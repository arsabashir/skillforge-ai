import { NextResponse } from "next/server";
import { validateTopic } from "@/lib/roadmap";
import { createLearningRoadmap } from "@/services/roadmap-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { topic?: unknown };
    const topic = validateTopic(body.topic);
    if (!topic) {
      return NextResponse.json({ error: "Enter a topic between 2 and 160 characters." }, { status: 400 });
    }

    const roadmap = await createLearningRoadmap(topic);
    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("Roadmap generation failed", error);
    const message = error instanceof Error ? error.message : "Could not generate a roadmap.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
