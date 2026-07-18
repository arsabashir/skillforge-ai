import type { AdaptiveQuiz, GenerateQuizRequest } from "@/lib/quiz";
import type { GenerateRoadmapRequest, LearningRoadmap } from "@/lib/roadmap";
import type { TutorRequest, TutorResponse } from "@/lib/tutor";
import { supabase } from "@/lib/supabase/client";

async function headers() {
  const token = supabase ? (await supabase.auth.getSession()).data.session?.access_token : null;
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export async function generateRoadmap(
  payload: GenerateRoadmapRequest,
): Promise<LearningRoadmap> {
  const response = await fetch("/api/roadmaps", {
    method: "POST",
    headers: await headers(),
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
    headers: await headers(),
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
    headers: await headers(),
    body: JSON.stringify(payload),
  });

  const body = (await response.json()) as TutorResponse | { error?: string };
  if (!response.ok) {
    throw new Error("error" in body ? body.error ?? "Could not get a tutor response." : "Could not get a tutor response.");
  }
  return body as TutorResponse;
}

export async function saveQuizAttempt(payload: { moduleId: string; moduleTitle: string; score: number; totalQuestions: number; misses: Array<{ questionId: string; concept: string }> }) {
  const response = await fetch("/api/progress/quiz-attempts", { method: "POST", headers: await headers(), body: JSON.stringify(payload) });
  if (!response.ok && response.status !== 401) throw new Error("Could not save quiz progress.");
}
