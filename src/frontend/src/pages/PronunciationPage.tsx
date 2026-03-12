import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Search,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { usePronunciationWords } from "../hooks/useQueries";

export default function PronunciationPage() {
  const navigate = useNavigate();
  const { data: words, isLoading } = usePronunciationWords();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const categories = [
    "All",
    ...Array.from(new Set(words?.map((w) => w.category) || [])),
  ];

  const filtered = words?.filter((w) => {
    const matchSearch = w.word.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      selectedCategory === "All" || w.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const speak = (word: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(word));
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
          <h1 className="font-serif text-xl font-bold">Pronunciation</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/60" />
          <Input
            data-ocid="pronunciation.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search words..."
            className="pl-9 bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/60 h-10 rounded-xl"
          />
        </div>
      </header>

      <div className="px-4 pt-3 pb-1 flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-4 py-3">
        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        )}

        {!isLoading && filtered?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No words found</p>
          </div>
        )}

        <div className="space-y-2">
          {filtered?.map((word, i) => {
            const isOpen = expanded === String(word.id);
            return (
              <div
                key={String(word.id)}
                data-ocid={`pronunciation.word.item.${i + 1}`}
                className="bg-card rounded-xl border border-border shadow-card overflow-hidden"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => setExpanded(isOpen ? null : String(word.id))}
                >
                  <div>
                    <p className="font-semibold text-sm">{word.word}</p>
                    <p className="text-muted-foreground text-xs font-mono">
                      {word.phonetic}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {word.category}
                    </Badge>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-0 border-t border-border">
                    <div className="flex items-center justify-between pt-3">
                      <div>
                        <p className="font-mono text-lg font-medium text-primary">
                          {word.phonetic}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {word.category}
                        </p>
                      </div>
                      <Button
                        data-ocid="pronunciation.audio.button"
                        onClick={() => speak(word.word)}
                        className="rounded-full h-12 w-12 p-0"
                      >
                        <Volume2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
