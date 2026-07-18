"use client";

import { FormEvent, useState } from "react";

type TopicFormProps = {
  onSubmit: (topic: string) => Promise<void>;
  isLoading: boolean;
};

export function TopicForm({ onSubmit, isLoading }: TopicFormProps) {
  const [topic, setTopic] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(topic);
  }

  return (
    <form className="topic-form" onSubmit={handleSubmit}>
      <label htmlFor="topic">What do you want to learn?</label>
      <div className="topic-input-row">
        <input
          id="topic"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="e.g. Python for data analysis"
          minLength={2}
          maxLength={160}
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Building…" : "Build roadmap"}
        </button>
      </div>
    </form>
  );
}
