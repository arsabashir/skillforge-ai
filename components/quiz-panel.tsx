"use client";

import { useState } from "react";
import { saveQuizAttempt } from "@/lib/api";
import type { AdaptiveQuiz } from "@/lib/quiz";
import type { ConfidenceLevel } from "@/lib/misconceptions";

type QuizPanelProps = {
  quiz: AdaptiveQuiz;
  onComplete: (result: { misses: Array<{ questionId: string; concept: string; confidence: ConfidenceLevel }>; score: number; totalQuestions: number }) => void;
};

export function QuizPanel({ quiz, onComplete }: QuizPanelProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confidence, setConfidence] = useState<Record<string, ConfidenceLevel>>({});

  const canSubmit = quiz.questions.every((question) => answers[question.id] !== undefined && confidence[question.id] !== undefined);
  const score = quiz.questions.filter((question) => answers[question.id] === question.correctOptionIndex).length;
  const answeredCount = Object.keys(answers).length;

  function submitQuiz() {
    const misses = quiz.questions
      .filter((question) => answers[question.id] !== question.correctOptionIndex)
      .map((question) => ({ questionId: question.id, concept: question.learningObjective, confidence: confidence[question.id] }));
    onComplete({ misses, score, totalQuestions: quiz.questions.length });
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
            <div className="confidence-picker" aria-label="Confidence before checking">
              <span>How sure are you?</span>
              {(["guessing", "somewhat_sure", "confident"] as ConfidenceLevel[]).map((level) => <label key={level}><input type="radio" name={`${question.id}-confidence`} checked={confidence[question.id] === level} onChange={() => setConfidence((current) => ({ ...current, [question.id]: level }))} />{level === "somewhat_sure" ? "Somewhat sure" : level[0].toUpperCase() + level.slice(1)}</label>)}
            </div>
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
