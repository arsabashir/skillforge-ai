export type RoadmapModule = {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  learningObjectives: string[];
};

export type LearningRoadmap = {
  topic: string;
  overview: string;
  modules: RoadmapModule[];
};

export type GenerateRoadmapRequest = { topic: string };

export const MAX_TOPIC_LENGTH = 160;

export function validateTopic(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const topic = value.trim().replace(/\s+/g, " ");
  return topic.length > 1 && topic.length <= MAX_TOPIC_LENGTH ? topic : null;
}
