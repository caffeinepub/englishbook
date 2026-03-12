import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { useGrammarLessons } from "../hooks/useQueries";

const categoryColors: Record<string, string> = {
  "Parts of Speech": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Tenses: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Articles: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  Prepositions: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "Active and Passive Voice": "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  "Direct and Indirect Speech":
    "bg-teal-500/10 text-teal-700 dark:text-teal-300",
};

export default function GrammarPage() {
  const navigate = useNavigate();
  const { data: lessons, isLoading } = useGrammarLessons();

  const grouped = lessons?.reduce(
    (acc, lesson) => {
      const cat = lesson.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(lesson);
      return acc;
    },
    {} as Record<string, typeof lessons>,
  );

  return (
    <div className="animate-fade-up">
      <header className="gradient-primary text-primary-foreground px-4 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <h1 className="font-serif text-xl font-bold">Grammar</h1>
          </div>
        </div>
        <p className="text-primary-foreground/80 text-sm pl-11">
          Master English grammar step by step
        </p>
      </header>

      <div className="px-4 py-4">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        )}

        {grouped &&
          Object.entries(grouped).map(([category, catLessons]) => (
            <div key={category} className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  {category}
                </h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="space-y-2">
                {catLessons?.map((lesson) => {
                  const globalIndex =
                    (lessons?.findIndex((l) => l.id === lesson.id) ?? 0) + 1;
                  return (
                    <Link
                      key={String(lesson.id)}
                      to="/grammar/$id"
                      params={{ id: String(lesson.id) }}
                      data-ocid={`grammar.lesson.item.${globalIndex}`}
                      className="flex items-center justify-between bg-card rounded-xl p-4 border border-border shadow-card hover:shadow-card-hover transition-all active:scale-98 block"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {lesson.title}
                        </p>
                        <div className="mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[category] || "bg-secondary text-secondary-foreground"}`}
                          >
                            {category}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

        {!isLoading && !lessons?.length && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📚</div>
            <p className="font-serif text-lg font-bold mb-2">No lessons yet</p>
            <p className="text-muted-foreground text-sm">
              Grammar lessons will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
