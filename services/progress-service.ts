import type { LearningRoadmap } from "@/lib/roadmap";
import type { WeakSpot } from "@/lib/weak-spots";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function saveRoadmap(userId: string, roadmap: LearningRoadmap) {
  if (!supabaseAdmin) return;
  await supabaseAdmin.from("learning_roadmaps").insert({ user_id: userId, topic: roadmap.topic, overview: roadmap.overview, modules: roadmap.modules });
}

export async function recordQuizResult(userId: string, input: { moduleId: string; moduleTitle: string; score: number; totalQuestions: number; misses: Array<{ questionId: string; concept: string }> }) {
  if (!supabaseAdmin) return;
  await supabaseAdmin.from("quiz_attempts").insert({ user_id: userId, module_id: input.moduleId, module_title: input.moduleTitle, score: input.score, total_questions: input.totalQuestions });
  for (const miss of input.misses) {
    const { data } = await supabaseAdmin.from("weak_spots").select("missed_question_ids").eq("user_id", userId).eq("module_id", input.moduleId).eq("concept", miss.concept).maybeSingle();
    const ids = [...new Set([...(data?.missed_question_ids ?? []), miss.questionId])];
    await supabaseAdmin.from("weak_spots").upsert({ user_id: userId, module_id: input.moduleId, concept: miss.concept, missed_question_ids: ids, last_missed_at: new Date().toISOString() });
  }
}

export async function getWeakSpots(userId: string, moduleId: string): Promise<WeakSpot[]> {
  if (!supabaseAdmin) return [];
  const { data } = await supabaseAdmin.from("weak_spots").select("module_id, concept, missed_question_ids, last_missed_at").eq("user_id", userId).eq("module_id", moduleId);
  return (data ?? []).map((spot) => ({ moduleId: spot.module_id, concept: spot.concept, missedQuestionIds: spot.missed_question_ids, lastMissedAt: spot.last_missed_at }));
}

export async function saveTutorMessages(userId: string, moduleId: string, messages: Array<{ role: "user" | "assistant"; content: string }>) {
  if (!supabaseAdmin) return;
  await supabaseAdmin.from("tutor_messages").insert(messages.map((message) => ({ user_id: userId, module_id: moduleId, role: message.role, content: message.content })));
}
