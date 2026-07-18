import type { RoadmapModule } from "@/lib/roadmap";

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  learningObjective: string;
};

export type AdaptiveQuiz = {
  moduleId: string;
  moduleTitle: string;
  questions: QuizQuestion[];
};

export type GenerateQuizRequest = {
  topic: string;
  module: RoadmapModule;
};

export function isValidQuizRequest(value: unknown): value is GenerateQuizRequest {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<GenerateQuizRequest>;
  return (
    typeof candidate.topic === "string" &&
    typeof candidate.module?.id === "string" &&
    typeof candidate.module.title === "string" &&
    typeof candidate.module.description === "string" &&
    Array.isArray(candidate.module.learningObjectives)
  );
}
