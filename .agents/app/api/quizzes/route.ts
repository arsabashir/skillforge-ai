import { NextResponse } from "next/server";
import { isValidQuizRequest } from "@/lib/quiz";
import { validateTopic } from "@/lib/roadmap";
import { createAdaptiveQuiz } from "@/services/quiz-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!isValidQuizRequest(body) || !validateTopic(body.topic)) {
      return NextResponse.json({ error: "Provide a valid topic and roadmap module." }, { status: 400 });
    }

    const quiz = await createAdaptiveQuiz({ ...body, topic: validateTopic(body.topic)! });
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Quiz generation failed", error);
    const message = error instanceof Error ? error.message : "Could not generate a quiz.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
