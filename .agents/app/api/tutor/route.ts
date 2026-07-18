import { NextResponse } from "next/server";
import { validateTopic } from "@/lib/roadmap";
import { isValidTutorRequest } from "@/lib/tutor";
import { createTutorResponse } from "@/services/tutor-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!isValidTutorRequest(body) || !validateTopic(body.topic)) {
      return NextResponse.json({ error: "Provide a valid tutor question and roadmap module." }, { status: 400 });
    }

    const response = await createTutorResponse({ ...body, topic: validateTopic(body.topic)! });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Tutor response failed", error);
    const message = error instanceof Error ? error.message : "Could not get a tutor response.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
