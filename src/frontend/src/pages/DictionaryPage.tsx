import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  Loader2,
  Search,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BookmarkType } from "../backend.d";
import { useAddBookmark } from "../hooks/useQueries";

interface DictDefinition {
  definition: string;
  example?: string;
}

interface DictMeaning {
  partOfSpeech: string;
  definitions: DictDefinition[];
}

interface DictEntry {
  word: string;
  phonetic?: string;
  phonetics?: { text?: string; audio?: string }[];
  meanings: DictMeaning[];
}

export default function DictionaryPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DictEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const addBookmark = useAddBookmark();

  const handleSearch = async () => {
    const word = query.trim();
    if (!word) return;
    setIsLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      );
      if (!res.ok) throw new Error("Word not found");
      const data: DictEntry[] = await res.json();
      setResults(data);
    } catch {
      setError("Word not found. Please try another word.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const speak = (word: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(word));
  };

  const handleBookmark = (word: string, meaning: string) => {
    addBookmark.mutate(
      { word, meaning, bookmarkType: BookmarkType.word },
      { onSuccess: () => toast.success("Bookmarked!") },
    );
  };

  const entry = results[0];
  const phonetic =
    entry?.phonetic || entry?.phonetics?.find((p) => p.text)?.text || "";

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
          <h1 className="font-serif text-xl font-bold">Dictionary</h1>
        </div>
        <div className="flex gap-2">
          <Input
            data-ocid="dictionary.search_input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search any English word..."
            className="bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/60 h-11 rounded-xl focus-visible:ring-white/50"
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-white text-primary hover:bg-white/90 h-11 rounded-xl px-4"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>
      </header>

      <div className="px-4 py-4">
        {isLoading && (
          <div
            data-ocid="dictionary.loading_state"
            className="flex justify-center py-12"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div
            data-ocid="dictionary.error_state"
            className="flex flex-col items-center gap-2 py-12 text-center"
          >
            <AlertCircle className="w-10 h-10 text-muted-foreground" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {!searched && !isLoading && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📖</div>
            <p className="font-serif text-lg font-bold mb-2">
              Search for any word
            </p>
            <p className="text-muted-foreground text-sm">
              Get meanings, phonetics, examples and more
            </p>
          </div>
        )}

        {entry && !isLoading && !error && (
          <div className="animate-fade-in">
            <div className="bg-card rounded-2xl shadow-card p-5 border border-border mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold">
                    {entry.word}
                  </h2>
                  {phonetic && (
                    <p className="text-muted-foreground font-mono text-sm mt-1">
                      {phonetic}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    data-ocid="dictionary.audio.button"
                    size="sm"
                    variant="outline"
                    onClick={() => speak(entry.word)}
                    className="rounded-full w-9 h-9 p-0 border-primary/30 text-primary"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  <Button
                    data-ocid="dictionary.bookmark.button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleBookmark(
                        entry.word,
                        entry.meanings[0]?.definitions[0]?.definition || "",
                      )
                    }
                    className="rounded-full w-9 h-9 p-0 border-primary/30 text-primary"
                    disabled={addBookmark.isPending}
                  >
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {entry.meanings.map((meaning, _mi) => (
              <div
                key={meaning.partOfSpeech}
                className="bg-card rounded-xl shadow-card p-4 border border-border mb-3"
              >
                <Badge variant="secondary" className="mb-3 font-medium">
                  {meaning.partOfSpeech}
                </Badge>
                <div className="space-y-3">
                  {meaning.definitions.slice(0, 3).map((def, di) => (
                    <div key={def.definition.slice(0, 20)}>
                      <p className="text-sm leading-relaxed">
                        {di + 1}. {def.definition}
                      </p>
                      {def.example && (
                        <p className="text-muted-foreground text-sm italic mt-1 pl-4">
                          "{def.example}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
