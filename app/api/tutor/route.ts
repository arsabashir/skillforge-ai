import { NextResponse } from "next/server";
import { validateTopic } from "@/lib/roadmap";
import { isRateLimited } from "@/lib/rate-limit";
import { getAuthenticatedUserId } from "@/lib/supabase/server";
import { isValidTutorRequest } from "@/lib/tutor";
import { createTutorResponse } from "@/services/tutor-service";
import { getWeakSpots, saveTutorMessages } from "@/services/progress-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (isRateLimited(request, "tutor", 10)) return NextResponse.json({ error: "Too many tutor requests. Please try again shortly." }, { status: 429 });
    const body: unknown = await request.json();
    if (!isValidTutorRequest(body) || !validateTopic(body.topic)) {
      return NextResponse.json({ error: "Provide a valid tutor question and roadmap module." }, { status: 400 });
    }

    const userId = await getAuthenticatedUserId(request);
    const persistedWeakSpots = userId ? await getWeakSpots(userId, body.module.id) : [];
    const response = await createTutorResponse({ ...body, topic: validateTopic(body.topic)!, weakSpots: persistedWeakSpots.length > 0 ? persistedWeakSpots : body.weakSpots });
    if (userId) await saveTutorMessages(userId, body.module.id, [body.messages.at(-1)!, { role: "assistant", content: response.answer }]);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Tutor response failed", error);
    const message = error instanceof Error ? error.message : "Could not get a tutor response.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
