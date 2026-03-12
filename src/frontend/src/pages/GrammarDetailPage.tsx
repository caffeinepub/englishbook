import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookMarked, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BookmarkType } from "../backend.d";
import { useAddBookmark, useGrammarLessons } from "../hooks/useQueries";

export default function GrammarDetailPage() {
  const params = useParams({ from: "/auth/grammar/$id" });
  const navigate = useNavigate();
  const { data: lessons, isLoading } = useGrammarLessons();
  const addBookmark = useAddBookmark();

  const lesson = lessons?.find((l) => String(l.id) === params.id);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  const handleSubmit = (qi: number) => {
    if (!answers[qi]) return;
    setSubmitted((prev) => ({ ...prev, [qi]: true }));
  };

  const handleBookmark = () => {
    if (!lesson) return;
    addBookmark.mutate(
      {
        word: lesson.title,
        meaning: lesson.explanation.slice(0, 100),
        bookmarkType: BookmarkType.phrase,
      },
      { onSuccess: () => toast.success("Lesson bookmarked!") },
    );
  };

  if (isLoading) {
    return (
      <div className="px-4 pt-10">
        <Skeleton className="h-8 w-40 mb-4" />
        <Skeleton className="h-40 rounded-xl mb-4" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-muted-foreground">Lesson not found</p>
        <Button onClick={() => navigate({ to: "/grammar" })} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <header className="gradient-primary text-primary-foreground px-4 pt-10 pb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/grammar" })}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-serif text-lg font-bold leading-tight">
              {lesson.title}
            </h1>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleBookmark}
            disabled={addBookmark.isPending}
            className="text-primary-foreground hover:bg-white/20"
          >
            <BookMarked className="w-4 h-4" />
          </Button>
        </div>
        <span className="ml-11 text-xs bg-white/20 px-2 py-1 rounded-full">
          {lesson.category}
        </span>
      </header>

      <div className="px-4 py-4 space-y-4">
        <div className="bg-card rounded-xl shadow-card p-5 border border-border">
          <h2 className="font-semibold text-base mb-3">📝 Explanation</h2>
          <p className="text-sm leading-relaxed text-foreground">
            {lesson.explanation}
          </p>
        </div>

        {lesson.examples.length > 0 && (
          <div className="bg-card rounded-xl shadow-card p-5 border border-border">
            <h2 className="font-semibold text-base mb-3">💡 Examples</h2>
            <div className="space-y-2">
              {lesson.examples.map((ex, _i) => (
                <div key={`ex-${ex.slice(0, 10)}`} className="flex gap-2">
                  <span className="text-primary font-bold text-sm mt-0.5">
                    •
                  </span>
                  <p className="text-sm italic text-foreground/90">{ex}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {lesson.practiceQuestions.length > 0 && (
          <div>
            <h2 className="font-semibold text-base mb-3">
              🎯 Practice Questions
            </h2>
            <div className="space-y-4">
              {lesson.practiceQuestions.map((q, qi) => (
                <div
                  key={q.question.slice(0, 20)}
                  className="bg-card rounded-xl shadow-card p-4 border border-border"
                >
                  <p className="font-medium text-sm mb-3">
                    {qi + 1}. {q.question}
                  </p>
                  <RadioGroup
                    value={answers[qi] || ""}
                    onValueChange={(val) =>
                      setAnswers((prev) => ({ ...prev, [qi]: val }))
                    }
                    disabled={submitted[qi]}
                    className="space-y-2"
                  >
                    {q.options.map((opt, oi) => {
                      const isCorrect =
                        submitted[qi] && opt === q.correctAnswer;
                      const isWrong =
                        submitted[qi] &&
                        opt === answers[qi] &&
                        opt !== q.correctAnswer;
                      return (
                        <div
                          key={opt}
                          className={`flex items-center gap-2 p-2 rounded-lg ${isCorrect ? "bg-emerald-500/10" : isWrong ? "bg-red-500/10" : ""}`}
                        >
                          <RadioGroupItem value={opt} id={`q${qi}-o${oi}`} />
                          <Label
                            htmlFor={`q${qi}-o${oi}`}
                            className="text-sm cursor-pointer flex-1"
                          >
                            {opt}
                          </Label>
                          {isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                          {isWrong && (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>
                  {!submitted[qi] && (
                    <Button
                      size="sm"
                      className="mt-3 w-full rounded-lg"
                      onClick={() => handleSubmit(qi)}
                      disabled={!answers[qi]}
                    >
                      Check Answer
                    </Button>
                  )}
                  {submitted[qi] && (
                    <div
                      className={`mt-3 p-3 rounded-lg text-sm ${answers[qi] === q.correctAnswer ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-red-500/10 text-red-700 dark:text-red-300"}`}
                    >
                      <p className="font-medium">
                        {answers[qi] === q.correctAnswer
                          ? "Correct!"
                          : `Correct answer: ${q.correctAnswer}`}
                      </p>
                      {q.explanation && (
                        <p className="mt-1 text-xs opacity-80">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
