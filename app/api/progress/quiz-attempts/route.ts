import { NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";
import { getAuthenticatedUserId } from "@/lib/supabase/server";
import { recordQuizResult } from "@/services/progress-service";

type QuizAttemptBody = { moduleId?: unknown; moduleTitle?: unknown; score?: unknown; totalQuestions?: unknown; misses?: unknown };

export async function POST(request: Request) {
  try {
    if (isRateLimited(request, "quiz-attempts", 30)) return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    const userId = await getAuthenticatedUserId(request);
    if (!userId) return NextResponse.json({ error: "Sign in to save progress." }, { status: 401 });
    const body = (await request.json()) as QuizAttemptBody;
    if (typeof body.moduleId !== "string" || typeof body.moduleTitle !== "string" || !Number.isInteger(body.score) || !Number.isInteger(body.totalQuestions) || !Array.isArray(body.misses)) {
      return NextResponse.json({ error: "Invalid quiz attempt." }, { status: 400 });
    }
    await recordQuizResult(userId, { moduleId: body.moduleId, moduleTitle: body.moduleTitle, score: body.score as number, totalQuestions: body.totalQuestions as number, misses: body.misses as Array<{ questionId: string; concept: string }> });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Saving quiz attempt failed", error);
    return NextResponse.json({ error: "Could not save quiz progress." }, { status: 500 });
  }
}
