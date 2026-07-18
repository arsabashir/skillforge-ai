"use client";

import { useState } from "react";
import { RoadmapDisplay } from "@/components/roadmap-display";
import { TopicForm } from "@/components/topic-form";
import { generateQuiz, generateRoadmap } from "@/lib/api";
import type { AdaptiveQuiz } from "@/lib/quiz";
import type { LearningRoadmap, RoadmapModule } from "@/lib/roadmap";
import type { WeakSpot } from "@/lib/weak-spots";

export default function Home() {
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizzes, setQuizzes] = useState<Record<string, AdaptiveQuiz | undefined>>({});
  const [loadingModuleId, setLoadingModuleId] = useState<string | null>(null);
  const [weakSpots, setWeakSpots] = useState<WeakSpot[]>([]);

  async function handleGenerate(topic: string) {
    setError(null);
    setIsLoading(true);
    try {
      setRoadmap(await generateRoadmap({ topic }));
      setQuizzes({});
      setWeakSpots([]);
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

  function handleQuizComplete(moduleId: string, misses: Array<{ questionId: string; concept: string }>) {
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

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">SkillForge AI</p>
        <h1>Turn curiosity into a learning plan.</h1>
        <p className="lede">Start with a topic. SkillForge will map the concepts, sequence the work, and prepare the ground for adaptive practice.</p>
        <TopicForm onSubmit={handleGenerate} isLoading={isLoading} />
        {error && <p className="error" role="alert">{error}</p>}
      </section>
      {roadmap && <RoadmapDisplay roadmap={roadmap} quizzes={quizzes} loadingModuleId={loadingModuleId} onStartQuiz={handleStartQuiz} onQuizComplete={handleQuizComplete} weakSpots={weakSpots} />}
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
