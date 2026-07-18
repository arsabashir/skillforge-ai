import type { AdaptiveQuiz, GenerateQuizRequest } from "@/lib/quiz";
import type { GenerateRoadmapRequest, LearningRoadmap } from "@/lib/roadmap";
import type { TutorRequest, TutorResponse } from "@/lib/tutor";

export async function generateRoadmap(
  payload: GenerateRoadmapRequest,
): Promise<LearningRoadmap> {
  const response = await fetch("/api/roadmaps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await response.json()) as LearningRoadmap | { error?: string };
  if (!response.ok) {
    throw new Error("error" in body ? body.error ?? "Could not create roadmap." : "Could not create roadmap.");
  }
  return body as LearningRoadmap;
}

export async function generateQuiz(payload: GenerateQuizRequest): Promise<AdaptiveQuiz> {
  const response = await fetch("/api/quizzes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await response.json()) as AdaptiveQuiz | { error?: string };
  if (!response.ok) {
    throw new Error("error" in body ? body.error ?? "Could not create quiz." : "Could not create quiz.");
  }
  return body as AdaptiveQuiz;
}

export async function askTutor(payload: TutorRequest): Promise<TutorResponse> {
  const response = await fetch("/api/tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await response.json()) as TutorResponse | { error?: string };
  if (!response.ok) {
    throw new Error("error" in body ? body.error ?? "Could not get a tutor response." : "Could not get a tutor response.");
  }
  return body as TutorResponse;
}
