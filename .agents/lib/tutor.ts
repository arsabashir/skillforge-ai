import type { RoadmapModule } from "@/lib/roadmap";
import type { WeakSpot } from "@/lib/weak-spots";

export type TutorMessage = {
  role: "user" | "assistant";
  content: string;
};

export type TutorRequest = {
  topic: string;
  module: RoadmapModule;
  weakSpots: WeakSpot[];
  messages: TutorMessage[];
};

export type TutorResponse = { answer: string };

export function isValidTutorRequest(value: unknown): value is TutorRequest {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<TutorRequest>;
  const module = candidate.module;
  return (
    typeof candidate.topic === "string" &&
    typeof module?.id === "string" &&
    typeof module.title === "string" &&
    typeof module.description === "string" &&
    Array.isArray(module.learningObjectives) &&
    Array.isArray(candidate.weakSpots) &&
    Array.isArray(candidate.messages) &&
    candidate.messages.length > 0 &&
    candidate.messages.every((message) =>
      message &&
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.length > 0 &&
      message.content.length <= 2_000,
    )
  );
}
