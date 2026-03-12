import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Home,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { QuestionType } from "../backend.d";
import { useQuizQuestions } from "../hooks/useQueries";

type Phase = "start" | "quiz" | "score";

export default function QuizPage() {
  const navigate = useNavigate();
  const { data: questions, isLoading } = useQuizQuestions();
  const [phase, setPhase] = useState<Phase>("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const current = questions?.[currentIndex];
  const total = questions?.length ?? 0;
  const progress = total > 0 ? (currentIndex / total) * 100 : 0;

  const handleStart = () => {
    setPhase("quiz");
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption("");
    setTextAnswer("");
    setSubmitted(false);
  };

  const handleSubmitAnswer = () => {
    if (!current) return;
    const answer =
      current.questionType === QuestionType.multipleChoice
        ? selectedOption
        : textAnswer;
    if (!answer.trim()) return;
    setSubmitted(true);
  };

  const handleNext = () => {
    if (!current) return;
    const answer =
      current.questionType === QuestionType.multipleChoice
        ? selectedOption
        : textAnswer;
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentIndex + 1 >= total) {
      setPhase("score");
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption("");
      setTextAnswer("");
      setSubmitted(false);
    }
  };

  const score = answers.filter((a, i) => {
    const q = questions?.[i];
    return q && a.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
  }).length;

  if (isLoading) {
    return (
      <div className="px-4 pt-10">
        <Skeleton className="h-8 w-40 mb-6" />
        <Skeleton className="h-48 rounded-xl mb-4" />
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <header className="gradient-primary text-primary-foreground px-4 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-serif text-xl font-bold">Test Yourself</h1>
        </div>
        {phase === "quiz" && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-primary-foreground/80 mb-2">
              <span>
                Question {currentIndex + 1} of {total}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/30" />
          </div>
        )}
      </header>

      <div className="px-4 py-6">
        {phase === "start" && (
          <div className="text-center">
            <div className="text-6xl mb-6">🧠</div>
            <h2 className="font-serif text-2xl font-bold mb-2">
              Test Your Knowledge
            </h2>
            <p className="text-muted-foreground mb-2">
              Put your English skills to the test
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              {total} questions • Multiple formats
            </p>
            <Button
              data-ocid="quiz.start.button"
              size="lg"
              className="w-full rounded-xl h-12 text-base font-semibold"
              onClick={handleStart}
              disabled={!total}
            >
              Start Quiz
            </Button>
          </div>
        )}

        {phase === "quiz" && current && (
          <div className="animate-fade-in">
            <div className="bg-card rounded-xl shadow-card p-5 border border-border mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {current.questionType === QuestionType.multipleChoice
                    ? "Multiple Choice"
                    : current.questionType === QuestionType.fillBlank
                      ? "Fill in the Blank"
                      : "Sentence Correction"}
                </span>
              </div>
              <p className="font-medium text-base leading-relaxed">
                {current.question}
              </p>
            </div>

            {current.questionType === QuestionType.multipleChoice && (
              <div className="space-y-2 mb-4">
                {current.options.map((opt, oi) => {
                  const isSelected = selectedOption === opt;
                  const isCorrect = submitted && opt === current.correctAnswer;
                  const isWrong =
                    submitted && isSelected && opt !== current.correctAnswer;
                  return (
                    <button
                      type="button"
                      key={opt}
                      data-ocid={`quiz.option.item.${oi + 1}`}
                      onClick={() => !submitted && setSelectedOption(opt)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${isCorrect ? "bg-emerald-500/10 border-emerald-500" : isWrong ? "bg-red-500/10 border-red-500" : isSelected ? "bg-primary/10 border-primary" : "bg-card border-border hover:bg-secondary/50"}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${isSelected || isCorrect ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
                      >
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="text-sm flex-1">{opt}</span>
                      {isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                      {isWrong && <XCircle className="w-4 h-4 text-red-500" />}
                    </button>
                  );
                })}
              </div>
            )}

            {(current.questionType === QuestionType.fillBlank ||
              current.questionType === QuestionType.sentenceCorrection) && (
              <div className="mb-4">
                <Input
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder={
                    current.questionType === QuestionType.fillBlank
                      ? "Fill in the blank..."
                      : "Write the corrected sentence..."
                  }
                  disabled={submitted}
                  className={`h-12 rounded-xl text-base ${submitted ? (textAnswer.trim().toLowerCase() === current.correctAnswer.trim().toLowerCase() ? "border-emerald-500 bg-emerald-500/5" : "border-red-500 bg-red-500/5") : ""}`}
                />
                {submitted && (
                  <div
                    className={`mt-2 p-3 rounded-lg text-sm ${textAnswer.trim().toLowerCase() === current.correctAnswer.trim().toLowerCase() ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-red-500/10 text-red-700 dark:text-red-300"}`}
                  >
                    {textAnswer.trim().toLowerCase() ===
                    current.correctAnswer.trim().toLowerCase()
                      ? "Correct!"
                      : `Answer: ${current.correctAnswer}`}
                  </div>
                )}
              </div>
            )}

            {submitted && current.explanation && (
              <div className="bg-secondary/50 rounded-xl p-3 mb-4">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Explanation:</span>{" "}
                  {current.explanation}
                </p>
              </div>
            )}

            {!submitted ? (
              <Button
                data-ocid="quiz.submit.button"
                className="w-full h-12 rounded-xl font-semibold"
                onClick={handleSubmitAnswer}
                disabled={
                  current.questionType === QuestionType.multipleChoice
                    ? !selectedOption
                    : !textAnswer.trim()
                }
              >
                Check Answer
              </Button>
            ) : (
              <Button
                className="w-full h-12 rounded-xl font-semibold"
                onClick={handleNext}
              >
                {currentIndex + 1 >= total ? "See Results" : "Next Question"}
              </Button>
            )}
          </div>
        )}

        {phase === "score" && (
          <div
            data-ocid="quiz.score.panel"
            className="animate-fade-in text-center"
          >
            <div className="text-6xl mb-4">
              {score / total >= 0.8 ? "🏆" : score / total >= 0.5 ? "👏" : "💪"}
            </div>
            <h2 className="font-serif text-3xl font-bold mb-1">
              {score}/{total}
            </h2>
            <p className="text-muted-foreground text-lg mb-1">
              {Math.round((score / total) * 100)}% correct
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {score / total >= 0.8
                ? "Excellent work!"
                : score / total >= 0.5
                  ? "Good effort!"
                  : "Keep practicing!"}
            </p>

            <div className="flex gap-3 mb-6">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl"
                onClick={handleStart}
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Try Again
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl"
                onClick={() => navigate({ to: "/dashboard" })}
              >
                <Home className="w-4 h-4 mr-2" /> Home
              </Button>
            </div>

            <div className="space-y-3 text-left">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Review
              </h3>
              {questions?.map((q, i) => {
                const userAnswer = answers[i] || "";
                const isCorrect =
                  userAnswer.trim().toLowerCase() ===
                  q.correctAnswer.trim().toLowerCase();
                return (
                  <div
                    key={q.id.toString()}
                    className="bg-card rounded-xl border border-border p-4"
                  >
                    <p className="text-sm font-medium mb-2">{q.question}</p>
                    <div className="flex items-center gap-2 text-xs">
                      {isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span
                        className={
                          isCorrect
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        Your answer: {userAnswer || "(no answer)"}
                      </span>
                    </div>
                    {!isCorrect && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Correct: {q.correctAnswer}
                      </p>
                    )}
                    {q.explanation && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
