import { NextResponse } from "next/server";
import { validateTopic } from "@/lib/roadmap";
import { isRateLimited } from "@/lib/rate-limit";
import { getAuthenticatedUserId } from "@/lib/supabase/server";
import { createLearningRoadmap } from "@/services/roadmap-service";
import { saveRoadmap } from "@/services/progress-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (isRateLimited(request, "roadmaps")) return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    const body = (await request.json()) as { topic?: unknown };
    const topic = validateTopic(body.topic);
    if (!topic) {
      return NextResponse.json({ error: "Enter a topic between 2 and 160 characters." }, { status: 400 });
    }

    const roadmap = await createLearningRoadmap(topic);
    const userId = await getAuthenticatedUserId(request);
    if (userId) await saveRoadmap(userId, roadmap);
    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("Roadmap generation failed", error);
    const message = error instanceof Error ? error.message : "Could not generate a roadmap.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
