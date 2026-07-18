import OpenAI from "openai";
import type { TutorRequest, TutorResponse } from "@/lib/tutor";
import { createMockTutorResponse } from "@/services/mock-learning-data";

export async function createTutorResponse(request: TutorRequest): Promise<TutorResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return createMockTutorResponse(request);

  const relevantWeakSpots = request.weakSpots
    .filter((spot) => spot.moduleId === request.module.id)
    .map((spot) => ({ concept: spot.concept, missedQuestions: spot.missedQuestionIds.length }));

  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-5.6",
    instructions:
      "You are SkillForge AI's patient learning tutor. Give a direct answer first, then a short explanation and a concrete example. Use the learner's weak-spot history to proactively contrast concepts they may confuse. Never claim they are weak at a concept unless it appears in the supplied history. Keep the response under 250 words and end with one brief check-for-understanding question.",
    input: JSON.stringify({
      topic: request.topic,
      currentModule: request.module,
      weakSpotHistoryForCurrentModule: relevantWeakSpots,
      conversation: request.messages.slice(-10),
    }),
  });

  if (!response.output_text) throw new Error("The model returned no tutor response.");
  return { answer: response.output_text };
}

// TODO: Load a user's persisted WeakSpot records server-side after Supabase auth is added.
