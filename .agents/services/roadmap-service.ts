import OpenAI from "openai";
import type { LearningRoadmap } from "@/lib/roadmap";
import { createMockRoadmap } from "@/services/mock-learning-data";

const roadmapSchema = {
  name: "learning_roadmap",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      topic: { type: "string" },
      overview: { type: "string" },
      modules: {
        type: "array",
        minItems: 3,
        maxItems: 8,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            estimatedMinutes: { type: "integer", minimum: 10, maximum: 240 },
            learningObjectives: {
              type: "array",
              minItems: 2,
              maxItems: 4,
              items: { type: "string" },
            },
          },
          required: ["id", "title", "description", "estimatedMinutes", "learningObjectives"],
        },
      },
    },
    required: ["topic", "overview", "modules"],
  },
} as const;

export async function createLearningRoadmap(topic: string): Promise<LearningRoadmap> {
  const apiKey = process.env.OPENAI_API_KEY;
  // Development mode: supplying OPENAI_API_KEY automatically switches this to the real API.
  if (!apiKey) return createMockRoadmap(topic);

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5.6",
      instructions:
        "You are SkillForge AI's curriculum designer. Create a practical, beginner-friendly learning sequence. Order modules from foundations to application. Keep descriptions concise and objectives measurable.",
      input: `Create a roadmap for: ${topic}`,
      text: { format: { type: "json_schema", ...roadmapSchema } },
    });

    if (!response.output_text) throw new Error("The model returned no roadmap content.");
    return JSON.parse(response.output_text) as LearningRoadmap;
  } catch (error) {
    // Safety net: if the real API fails (quota, rate limit, network, etc.), fall back to
    // mock data instead of breaking the demo. Logged server-side so it's easy to spot in dev.
    console.warn("Roadmap API call failed, falling back to mock data:", error);
    return createMockRoadmap(topic);
  }
}

// TODO: After Supabase auth is added, persist a roadmap keyed to the authenticated user.