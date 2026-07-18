import type { AdaptiveQuiz } from "@/lib/quiz";
import type { LearningRoadmap, RoadmapModule } from "@/lib/roadmap";
import type { TutorRequest, TutorResponse } from "@/lib/tutor";

export function createMockRoadmap(topic: string): LearningRoadmap {
  return {
    topic,
    overview: `A practical five-part introduction to ${topic}, moving from core language to confident application.`,
    modules: [
      {
        id: "foundations",
        title: `Foundations of ${topic}`,
        description: "Learn the essential vocabulary, the main problems this field solves, and how its parts fit together.",
        estimatedMinutes: 45,
        learningObjectives: ["Define the core terms", "Explain the big-picture workflow"],
      },
      {
        id: "core-concepts",
        title: "Core concepts and mental models",
        description: "Build the mental models that let you reason about new examples instead of memorizing isolated facts.",
        estimatedMinutes: 60,
        learningObjectives: ["Recognize the fundamental concepts", "Connect causes, effects, and trade-offs"],
      },
      {
        id: "guided-practice",
        title: "Guided practice",
        description: "Apply the concepts in small, well-scoped exercises and learn to spot common mistakes.",
        estimatedMinutes: 75,
        learningObjectives: ["Apply concepts to a simple scenario", "Identify and correct common errors"],
      },
      {
        id: "real-world-application",
        title: "Real-world application",
        description: "Work through a realistic end-to-end example and choose an approach that fits its constraints.",
        estimatedMinutes: 90,
        learningObjectives: ["Break down a real-world problem", "Justify an appropriate solution"],
      },
      {
        id: "next-steps",
        title: "Review and next steps",
        description: "Consolidate your understanding, locate gaps, and select a focused next project.",
        estimatedMinutes: 30,
        learningObjectives: ["Assess your current understanding", "Plan a next learning step"],
      },
    ],
  };
}

export function createMockQuiz(module: RoadmapModule): AdaptiveQuiz {
  const primaryObjective = module.learningObjectives[0] ?? "Explain the core concept";
  const secondaryObjective = module.learningObjectives[1] ?? "Apply the concept";

  return {
    moduleId: module.id,
    moduleTitle: module.title,
    questions: [
      {
        id: `${module.id}-q1`,
        prompt: `Which approach best supports a beginner learning ${module.title}?`,
        options: ["Memorize terms without examples", "Build a clear mental model before tackling complex cases", "Skip fundamentals and start with edge cases", "Use only one source and never practice"],
        correctOptionIndex: 1,
        explanation: "A mental model gives new learners a framework for understanding examples and making informed decisions.",
        learningObjective: primaryObjective,
      },
      {
        id: `${module.id}-q2`,
        prompt: "What is the most useful way to test whether you understand a new concept?",
        options: ["Repeat its definition verbatim", "Avoid questions until the end", "Apply it to a small, unfamiliar scenario and explain your reasoning", "Focus only on the easiest examples"],
        correctOptionIndex: 2,
        explanation: "Applying a concept and explaining your reasoning checks understanding more deeply than recalling a definition.",
        learningObjective: secondaryObjective,
      },
      {
        id: `${module.id}-q3`,
        prompt: "When you get an answer wrong during practice, what should you do next?",
        options: ["Ignore it and move on", "Identify the mistaken assumption, review the concept, then retry a similar example", "Change every answer at random", "Stop practicing the topic"],
        correctOptionIndex: 1,
        explanation: "Pinpointing the mistaken assumption turns an error into a focused opportunity to strengthen the concept.",
        learningObjective: "Identify and correct common errors",
      },
      {
        id: `${module.id}-q4`,
        prompt: "Which result most strongly suggests you are ready for a more advanced exercise?",
        options: ["You can solve a basic case and explain why your approach works", "You have read the module title", "You can repeat one answer without context", "You have avoided all feedback"],
        correctOptionIndex: 0,
        explanation: "Being able to solve and explain a basic case demonstrates transferable understanding, not just familiarity.",
        learningObjective: primaryObjective,
      },
    ],
  };
}

export function createMockTutorResponse(request: TutorRequest): TutorResponse {
  const question = request.messages[request.messages.length - 1]?.content ?? "Can you explain this?";
  const weakSpots = request.weakSpots.filter((spot) => spot.moduleId === request.module.id);
  const weakSpotGuidance = weakSpots.length > 0
    ? ` You have previously missed questions about ${weakSpots.map((spot) => spot.concept).join(" and ")}. Keep that distinction in view: name the idea, explain what it does, then compare it with the closest alternative.`
    : " Start by identifying the purpose of the idea, then connect it to a small example.";

  return {
    answer: `For ${request.module.title}, a helpful way to approach your question is to separate the core idea from its application. ${question} First, restate the key concept in your own words. Next, apply it to one simple case and explain why that case fits.${weakSpotGuidance}\n\nTry this: describe one example where the concept applies, and one similar example where it does not. What is the deciding difference?`,
  };
}
