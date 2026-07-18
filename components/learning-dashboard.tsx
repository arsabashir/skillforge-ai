import type { LearningRoadmap } from "@/lib/roadmap";
import type { WeakSpot } from "@/lib/weak-spots";

type LearningDashboardProps = { roadmap: LearningRoadmap; completedModuleIds: string[]; weakSpots: WeakSpot[] };

export function LearningDashboard({ roadmap, completedModuleIds, weakSpots }: LearningDashboardProps) {
  const complete = roadmap.modules.filter((module) => completedModuleIds.includes(module.id)).length;
  const progress = Math.round((complete / roadmap.modules.length) * 100);
  const nextModule = roadmap.modules.find((module) => !completedModuleIds.includes(module.id));
  return (
    <section className="learning-dashboard" aria-label="Learning dashboard">
      <div><span className="dashboard-value">{progress}%</span><span className="dashboard-label">Course progress</span></div>
      <div><span className="dashboard-value">{complete}/{roadmap.modules.length}</span><span className="dashboard-label">Modules complete</span></div>
      <div><span className="dashboard-value">{weakSpots.length}</span><span className="dashboard-label">Concepts to review</span></div>
      <div className="next-module"><span className="dashboard-label">Up next</span><strong>{nextModule?.title ?? "Roadmap complete - great work!"}</strong></div>
    </section>
  );
}
