"use client";

import { FormEvent, useState } from "react";
import { askTutor } from "@/lib/api";
import type { RoadmapModule } from "@/lib/roadmap";
import type { TutorMessage } from "@/lib/tutor";
import type { WeakSpot } from "@/lib/weak-spots";

type TutorChatProps = {
  topic: string;
  module: RoadmapModule;
  weakSpots: WeakSpot[];
};

export function TutorChat({ topic, module, weakSpots }: TutorChatProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = question.trim();
    if (!content || isLoading) return;

    const nextMessages: TutorMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setQuestion("");
    setError(null);
    setIsLoading(true);
    try {
      const response = await askTutor({ topic, module, weakSpots, messages: nextMessages });
      setMessages((current) => [...current, { role: "assistant", content: response.answer }]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not get a tutor response.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="tutor-chat" aria-label={`Tutor chat for ${module.title}`}>
      <p className="eyebrow">AI tutor</p>
      <h4>Ask about {module.title}</h4>
      {messages.length > 0 && (
        <div className="chat-messages" aria-live="polite">
          {messages.map((message, index) => (
            <p className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>{message.content}</p>
          ))}
          {isLoading && <p className="chat-message assistant">Thinking...</p>}
        </div>
      )}
      <form onSubmit={handleSubmit} className="chat-form">
        <label htmlFor={`tutor-${module.id}`}>Your question</label>
        <textarea
          id={`tutor-${module.id}`}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="What part feels unclear?"
          maxLength={2_000}
          disabled={isLoading}
          required
        />
        <button type="submit" disabled={isLoading}>{isLoading ? "Thinking..." : "Ask tutor"}</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
    </section>
  );
}
