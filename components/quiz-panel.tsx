"use client";

import { useState } from "react";
import { saveQuizAttempt } from "@/lib/api";
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
  const answeredCount = Object.keys(answers).length;

  function submitQuiz() {
    const misses = quiz.questions
      .filter((question) => answers[question.id] !== question.correctOptionIndex)
      .map((question) => ({ questionId: question.id, concept: question.learningObjective }));
    onComplete(misses);
    void saveQuizAttempt({ moduleId: quiz.moduleId, moduleTitle: quiz.moduleTitle, score, totalQuestions: quiz.questions.length, misses }).catch(console.error);
    setIsSubmitted(true);
  }

  return (
    <section className="quiz-panel" aria-label={`${quiz.moduleTitle} quiz`}>
      <p className="eyebrow">Quick check</p>
      <h4>{quiz.moduleTitle} quiz</h4>
      <p className="quiz-progress">Answered {answeredCount}/{quiz.questions.length}{isSubmitted ? ` · Score ${score}/${quiz.questions.length}` : ""}</p>
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
      {isSubmitted ? (
        <p className="quiz-score">Score: {score}/{quiz.questions.length}. Missed concepts have been added to your weak-spot history for this session.</p>
      ) : (
        <button type="button" onClick={submitQuiz} disabled={!canSubmit}>Check answers</button>
      )}
    </section>
  );
}
