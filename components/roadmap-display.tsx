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
  onQuizComplete: (moduleId: string, result: { misses: Array<{ questionId: string; concept: string; confidence: import("@/lib/misconceptions").ConfidenceLevel }>; score: number; totalQuestions: number }) => void;
  weakSpots: WeakSpot[];
  completedModuleIds: string[];
  onToggleModuleComplete: (moduleId: string) => void;
};

export function RoadmapDisplay({ roadmap, quizzes, loadingModuleId, onStartQuiz, onQuizComplete, weakSpots, completedModuleIds, onToggleModuleComplete }: RoadmapDisplayProps) {
  const completedCount = roadmap.modules.filter((module) => completedModuleIds.includes(module.id)).length;
  const progress = Math.round((completedCount / roadmap.modules.length) * 100);
  return (
    <section className="roadmap" aria-live="polite">
      <p className="eyebrow">Your learning path</p>
      <h2>{roadmap.topic}</h2>
      <p className="overview">{roadmap.overview}</p>
      <section className="roadmap-progress" aria-label={`Roadmap progress: ${completedCount} of ${roadmap.modules.length} modules complete`}>
        <div className="progress-label"><span>Learning progress</span><span>{completedCount}/{roadmap.modules.length} modules · {progress}%</span></div>
        <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <div className="progress-value" style={{ width: `${progress}%` }} />
        </div>
      </section>
      <ol className="module-list">
        {roadmap.modules.map((module, index) => {
          const quiz = quizzes[module.id];
          const isComplete = completedModuleIds.includes(module.id);
          return (
          <li key={module.id} className="module-card">
            <span className="module-number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <div className="module-heading">
                <h3>{module.title}</h3>
                <span>{module.estimatedMinutes} min</span>
              </div>
              <p>{module.description}</p>
              <ul>
                {module.learningObjectives.map((objective) => <li key={objective}>{objective}</li>)}
              </ul>
              <section className="lesson-guide">
                <h4>Lesson guide</h4>
                <p><strong>Learn:</strong> Focus on {module.learningObjectives.join(" and ").toLowerCase()}.</p>
                <p><strong>Practise:</strong> Spend 15 minutes building or explaining one small example from this module before taking the quiz.</p>
              </section>
              <button className="complete-button" type="button" onClick={() => onToggleModuleComplete(module.id)}>
                {isComplete ? "Mark as incomplete" : "Mark module complete"}
              </button>
              {!quiz && (
                <button type="button" onClick={() => onStartQuiz(module)} disabled={loadingModuleId !== null}>
                  {loadingModuleId === module.id ? "Creating quiz…" : "Start quiz"}
                </button>
              )}
              {quiz && (
                <QuizPanel
                  quiz={quiz}
                  onComplete={(result) => onQuizComplete(module.id, result)}
                />
              )}
              <TutorChat topic={roadmap.topic} module={module} weakSpots={weakSpots} />
            </div>
          </li>
          );
        })}
      </ol>
    </section>
  );
}
