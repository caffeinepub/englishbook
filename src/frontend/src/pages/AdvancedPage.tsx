import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BookmarkType, IdiomCategory } from "../backend.d";
import { useAddBookmark, useIdiomsPhrases } from "../hooks/useQueries";

const CATEGORIES = ["All", "Idiom", "Phrase", "Expression"] as const;
type CatFilter = (typeof CATEGORIES)[number];

const categoryMap: Record<CatFilter, IdiomCategory | null> = {
  All: null,
  Idiom: IdiomCategory.idiom,
  Phrase: IdiomCategory.phrase,
  Expression: IdiomCategory.expression,
};

const categoryColors: Record<string, string> = {
  idiom: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  phrase: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
  expression: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export default function AdvancedPage() {
  const navigate = useNavigate();
  const { data: entries, isLoading } = useIdiomsPhrases();
  const addBookmark = useAddBookmark();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CatFilter>("All");

  const filtered = entries?.filter((e) => {
    const matchSearch =
      e.term.toLowerCase().includes(search.toLowerCase()) ||
      e.meaning.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      categoryMap[category] === null || e.category === categoryMap[category];
    return matchSearch && matchCat;
  });

  const handleBookmark = (term: string, meaning: string) => {
    addBookmark.mutate(
      { word: term, meaning, bookmarkType: BookmarkType.phrase },
      { onSuccess: () => toast.success("Bookmarked!") },
    );
  };

  return (
    <div className="animate-fade-up">
      <header className="gradient-primary text-primary-foreground px-4 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-serif text-xl font-bold">Advanced Learning</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/60" />
          <Input
            data-ocid="advanced.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search idioms, phrases..."
            className="pl-9 bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/60 h-10 rounded-xl"
          />
        </div>
      </header>

      <div className="px-4 pt-3 pb-1 flex gap-2">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            data-ocid="advanced.filter.tab"
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${category === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-4 py-3">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        )}

        {!isLoading && filtered?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-muted-foreground">No entries found</p>
          </div>
        )}

        <div className="space-y-3">
          {filtered?.map((entry, i) => (
            <div
              key={String(entry.id)}
              data-ocid={`advanced.entry.item.${i + 1}`}
              className="bg-card rounded-xl shadow-card p-4 border border-border"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-base">{entry.term}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${categoryColors[entry.category] || "bg-secondary"}`}
                  >
                    {entry.category}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0 text-muted-foreground hover:text-primary"
                  onClick={() => handleBookmark(entry.term, entry.meaning)}
                  disabled={addBookmark.isPending}
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm font-medium mb-1">{entry.meaning}</p>
              <p className="text-sm text-muted-foreground italic mb-2">
                "{entry.exampleSentence}"
              </p>
              {entry.usageExplanation && (
                <p className="text-xs text-muted-foreground border-t border-border pt-2">
                  {entry.usageExplanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
