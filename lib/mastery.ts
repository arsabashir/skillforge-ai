import type { LearningRoadmap } from "@/lib/roadmap";

export type MasteryStatus = "not_assessed" | "learning" | "struggling" | "mastered";

export type MasteryNode = {
  id: string;
  moduleId: string;
  concept: string;
  status: MasteryStatus;
  evidenceCount: number;
};

export function createMasteryMap(roadmap: LearningRoadmap): MasteryNode[] {
  return roadmap.modules.flatMap((module) => module.learningObjectives.map((concept, index) => ({
    id: `${module.id}-${index}`,
    moduleId: module.id,
    concept,
    status: "not_assessed" as const,
    evidenceCount: 0,
  })));
}
