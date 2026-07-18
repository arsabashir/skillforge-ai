import OpenAI from "openai";
import type { AdaptiveQuiz, GenerateQuizRequest } from "@/lib/quiz";
import { createMockQuiz } from "@/services/mock-learning-data";

const quizSchema = {
  name: "adaptive_quiz",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      moduleId: { type: "string" },
      moduleTitle: { type: "string" },
      questions: {
        type: "array",
        minItems: 3,
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            prompt: { type: "string" },
            options: { type: "array", minItems: 4, maxItems: 4, items: { type: "string" } },
            correctOptionIndex: { type: "integer", minimum: 0, maximum: 3 },
            explanation: { type: "string" },
            learningObjective: { type: "string" },
          },
          required: ["id", "prompt", "options", "correctOptionIndex", "explanation", "learningObjective"],
        },
      },
    },
    required: ["moduleId", "moduleTitle", "questions"],
  },
} as const;

export async function createAdaptiveQuiz({ topic, module }: GenerateQuizRequest): Promise<AdaptiveQuiz> {
  const apiKey = process.env.OPENAI_API_KEY;
  // Development mode: supplying OPENAI_API_KEY automatically switches this to the real API.
  if (!apiKey) return createMockQuiz(module);

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5.6",
      instructions:
        "You are SkillForge AI's assessment designer. Create a short diagnostic quiz with four plausible answer choices per question. Test understanding rather than trivia. Give a concise, constructive explanation for every answer. Return questions ordered from foundational to applied.",
      input: JSON.stringify({
        topic,
        module: {
          id: module.id,
          title: module.title,
          description: module.description,
          learningObjectives: module.learningObjectives,
        },
      }),
      text: { format: { type: "json_schema", ...quizSchema } },
    });

    if (!response.output_text) throw new Error("The model returned no quiz content.");
    return JSON.parse(response.output_text) as AdaptiveQuiz;
  } catch (error) {
    // Safety net: if the real API fails (quota, rate limit, network, etc.), fall back to
    // mock data instead of breaking the demo. Logged server-side so it's easy to spot in dev.
    console.warn("Quiz API call failed, falling back to mock data:", error);
    return createMockQuiz(module);
  }
}

// TODO: Use recent WeakSpot records to adapt question difficulty and concept coverage.