"use client";

import { useState } from "react";
import { QuizPanel } from "@/components/quiz-panel";
import { TutorChat } from "@/components/tutor-chat";
import type { AdaptiveQuiz } from "@/lib/quiz";
import type { LearningRoadmap, RoadmapModule } from "@/lib/roadmap";
import type { WeakSpot } from "@/lib/weak-spots";

type RoadmapDisplayProps = {
  roadmap: LearningRoadmap;
  quizzes: Record<string, AdaptiveQuiz | undefined>;
  loadingModuleId: string | null;
  onStartQuiz: (module: RoadmapModule) => Promise<void>;
  onQuizComplete: (moduleId: string, misses: Array<{ questionId: string; concept: string }>) => void;
  weakSpots: WeakSpot[];
};

export function RoadmapDisplay({ roadmap, quizzes, loadingModuleId, onStartQuiz, onQuizComplete, weakSpots }: RoadmapDisplayProps) {
  const [completedModuleIds, setCompletedModuleIds] = useState<Set<string>>(new Set());
  const [openTutorIds, setOpenTutorIds] = useState<Set<string>>(new Set());

  const totalModules = roadmap.modules.length;
  const completedCount = completedModuleIds.size;
  const progressPct = totalModules === 0 ? 0 : Math.round((completedCount / totalModules) * 100);

  function handleModuleComplete(moduleId: string, misses: Array<{ questionId: string; concept: string }>) {
    setCompletedModuleIds((current) => new Set(current).add(moduleId));
    onQuizComplete(moduleId, misses);
  }

  function toggleTutor(moduleId: string) {
    setOpenTutorIds((current) => {
      const next = new Set(current);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });
  }

  return (
    <section className="roadmap" aria-live="polite">
      <p className="eyebrow">Your learning path</p>
      <h2>{roadmap.topic}</h2>
      <p className="overview">{roadmap.overview}</p>

      <div className="progress-summary">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="progress-label">{completedCount} of {totalModules} modules complete</span>
      </div>

      <ol className="module-list">
        <div className="module-list-progress" style={{ height: `${progressPct}%` }} />
        {roadmap.modules.map((module, index) => {
          const quiz = quizzes[module.id];
          const isComplete = completedModuleIds.has(module.id);
          const isTutorOpen = openTutorIds.has(module.id);
          const moduleWeakSpots = weakSpots.filter((spot) => spot.moduleId === module.id);

          return (
            <li key={module.id} className={`module-card${isComplete ? " module-card--complete" : ""}`}>
              <span className="module-number">{isComplete ? "✓" : String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className="module-heading">
                  <h3>{module.title}</h3>
                  <span>{module.estimatedMinutes} min</span>
                </div>
                <p>{module.description}</p>
                <ul>
                  {module.learningObjectives.map((objective) => <li key={objective}>{objective}</li>)}
                </ul>

                {moduleWeakSpots.length > 0 && (
                  <div className="weak-spot-pills" aria-label="Concepts to review">
                    {moduleWeakSpots.map((spot) => (
                      <span
                        key={spot.concept}
                        className="weak-spot-pill"
                        title={`Missed ${spot.missedQuestionIds.length} question${spot.missedQuestionIds.length === 1 ? "" : "s"}`}
                      >
                        ⚠ {spot.concept}
                      </span>
                    ))}
                  </div>
                )}

                {!quiz && (
                  <button type="button" onClick={() => onStartQuiz(module)} disabled={loadingModuleId !== null}>
                    {loadingModuleId === module.id ? "Creating quiz…" : "Start quiz"}
                  </button>
                )}
                {quiz && (
                  <QuizPanel quiz={quiz} onComplete={(misses) => handleModuleComplete(module.id, misses)} />
                )}

                <button
                  type="button"
                  className="tutor-toggle"
                  onClick={() => toggleTutor(module.id)}
                  aria-expanded={isTutorOpen}
                >
                  {isTutorOpen ? "Hide AI Tutor ▴" : "Ask AI Tutor ▾"}
                </button>
                {isTutorOpen && <TutorChat topic={roadmap.topic} module={module} weakSpots={weakSpots} />}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}