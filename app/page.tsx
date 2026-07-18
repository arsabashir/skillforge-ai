"use client";

import { useState } from "react";
import { RoadmapDisplay } from "@/components/roadmap-display";
import { LearningDashboard } from "@/components/learning-dashboard";
import { MasteryMap } from "@/components/mastery-map";
import { RepairChallenge } from "@/components/repair-challenge";
import { MisconceptionPanel } from "@/components/misconception-panel";
import { AuthPanel } from "@/components/auth-panel";
import { TopicForm } from "@/components/topic-form";
import { generateQuiz, generateRoadmap } from "@/lib/api";
import type { AdaptiveQuiz } from "@/lib/quiz";
import type { LearningRoadmap, RoadmapModule } from "@/lib/roadmap";
import type { WeakSpot } from "@/lib/weak-spots";
import { createMasteryMap, type MasteryNode } from "@/lib/mastery";
import type { ConfidenceLevel, MisconceptionFingerprint } from "@/lib/misconceptions";

export default function Home() {
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizzes, setQuizzes] = useState<Record<string, AdaptiveQuiz | undefined>>({});
  const [loadingModuleId, setLoadingModuleId] = useState<string | null>(null);
  const [weakSpots, setWeakSpots] = useState<WeakSpot[]>([]);
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>([]);
  const [masteryNodes, setMasteryNodes] = useState<MasteryNode[]>([]);
  const [misconceptions, setMisconceptions] = useState<MisconceptionFingerprint[]>([]);

  async function handleGenerate(topic: string) {
    setError(null);
    setIsLoading(true);
    try {
      const nextRoadmap = await generateRoadmap({ topic });
      setRoadmap(nextRoadmap);
      setQuizzes({});
      setWeakSpots([]);
      setCompletedModuleIds([]);
      setMasteryNodes(createMasteryMap(nextRoadmap));
      setMisconceptions([]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create a roadmap.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStartQuiz(module: RoadmapModule) {
    if (!roadmap) return;
    setError(null);
    setLoadingModuleId(module.id);
    try {
      const quiz = await generateQuiz({ topic: roadmap.topic, module });
      setQuizzes((current) => ({ ...current, [module.id]: quiz }));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create a quiz.");
    } finally {
      setLoadingModuleId(null);
    }
  }

  function handleQuizComplete(moduleId: string, result: { misses: Array<{ questionId: string; concept: string; confidence: ConfidenceLevel }>; score: number; totalQuestions: number }) {
    const { misses } = result;
    setCompletedModuleIds((current) => current.includes(moduleId) ? current : [...current, moduleId]);
    setMasteryNodes((current) => current.map((node) => {
      if (node.moduleId !== moduleId) return node;
      const status = misses.length === 0 || result.score / result.totalQuestions >= 0.75 ? "mastered" : "struggling";
      return { ...node, status, evidenceCount: node.evidenceCount + 1 };
    }));
    const confidentMisses = misses.filter((miss) => miss.confidence === "confident");
    if (confidentMisses.length > 0) setMisconceptions((current) => {
      const additions = confidentMisses.map((miss) => ({ concept: miss.concept, moduleId, confidence: miss.confidence, message: "Answered incorrectly while confident - compare this idea with its closest alternative before moving on." }));
      return [...current.filter((item) => !additions.some((addition) => addition.moduleId === item.moduleId && addition.concept === item.concept)), ...additions];
    });
    if (misses.length === 0) return;
    const completedAt = new Date().toISOString();
    setWeakSpots((current) => {
      const next = [...current];
      for (const miss of misses) {
        const existing = next.find((weakSpot) => weakSpot.moduleId === moduleId && weakSpot.concept === miss.concept);
        if (existing) {
          existing.missedQuestionIds = [...new Set([...existing.missedQuestionIds, miss.questionId])];
          existing.lastMissedAt = completedAt;
        } else {
          next.push({ moduleId, concept: miss.concept, missedQuestionIds: [miss.questionId], lastMissedAt: completedAt });
        }
      }
      return next;
    });
    // TODO: Persist these records through WeakSpotStore once a user is authenticated.
  }

  function toggleModuleComplete(moduleId: string) {
    setCompletedModuleIds((current) => current.includes(moduleId) ? current.filter((id) => id !== moduleId) : [...current, moduleId]);
  }

  const repairNode = masteryNodes.find((node) => node.status === "struggling");

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">SkillForge AI</p>
        <h1>Turn curiosity into a learning plan.</h1>
        <p className="lede">Start with a topic. SkillForge will map the concepts, sequence the work, and prepare the ground for adaptive practice.</p>
        <AuthPanel />
        <TopicForm onSubmit={handleGenerate} isLoading={isLoading} />
        {error && <p className="error" role="alert">{error}</p>}
      </section>
      {roadmap && <>
        <LearningDashboard roadmap={roadmap} completedModuleIds={completedModuleIds} weakSpots={weakSpots} />
        <MasteryMap nodes={masteryNodes} />
        <MisconceptionPanel fingerprints={misconceptions} />
        {repairNode && <RepairChallenge concept={repairNode} onComplete={() => setMasteryNodes((current) => current.map((node) => node.id === repairNode.id ? { ...node, status: "learning" } : node))} />}
        <RoadmapDisplay roadmap={roadmap} quizzes={quizzes} loadingModuleId={loadingModuleId} onStartQuiz={handleStartQuiz} onQuizComplete={handleQuizComplete} weakSpots={weakSpots} completedModuleIds={completedModuleIds} onToggleModuleComplete={toggleModuleComplete} />
      </>}
      {weakSpots.length > 0 && (
        <aside className="weak-spots" aria-live="polite">
          <p className="eyebrow">Weak-spot history</p>
          <p>We’ll use these concepts to tailor future quizzes and tutor explanations.</p>
          <ul>{weakSpots.map((spot) => <li key={`${spot.moduleId}-${spot.concept}`}>{spot.concept}</li>)}</ul>
        </aside>
      )}
    </main>
  );
}
