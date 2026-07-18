"use client";

import { useState } from "react";
import type { AdaptiveQuiz } from "@/lib/quiz";

type QuizPanelProps = {
  quiz: AdaptiveQuiz;
  onComplete: (misses: Array<{ questionId: string; concept: string }>) => void;
};

export function QuizPanel({ quiz, onComplete }: QuizPanelProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const canSubmit = quiz.questions.every((question) => answers[question.id] !== undefined);
  const score = quiz.questions.filter((question) => answers[question.id] === question.correctOptionIndex).length;

  function submitQuiz() {
    const misses = quiz.questions
      .filter((question) => answers[question.id] !== question.correctOptionIndex)
      .map((question) => ({ questionId: question.id, concept: question.learningObjective }));
    onComplete(misses);
    setIsSubmitted(true);
  }

  return (
    <section className="quiz-panel" aria-label={`${quiz.moduleTitle} quiz`}>
      <p className="eyebrow">Quick check</p>
      <h4>{quiz.moduleTitle} quiz</h4>
      {quiz.questions.map((question, questionIndex) => {
        const selectedAnswer = answers[question.id];
        const isCorrect = selectedAnswer === question.correctOptionIndex;
        return (
          <fieldset className="quiz-question" key={question.id} disabled={isSubmitted}>
            <legend>{questionIndex + 1}. {question.prompt}</legend>
            {question.options.map((option, optionIndex) => (
              <label className="quiz-option" key={option}>
                <input
                  type="radio"
                  name={question.id}
                  checked={selectedAnswer === optionIndex}
                  onChange={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                />
                {option}
              </label>
            ))}
            {isSubmitted && (
              <p className={isCorrect ? "answer-feedback correct" : "answer-feedback incorrect"}>
                {isCorrect ? "Correct. " : "Not quite. "}{question.explanation}
              </p>
            )}
          </fieldset>
        );
      })}
     <p className="quiz-score">
  Score: {score}/{quiz.questions.length}.{" "}
  {score === quiz.questions.length
    ? "Nice work — no weak spots from this quiz."
    : "Missed concepts have been added to your weak-spot history for this session."}
</p>
    </section>
  );
}
