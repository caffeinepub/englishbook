import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  GraduationCap,
  Moon,
  PenLine,
  Search,
  Star,
  Sun,
  Volume1,
  Volume2,
} from "lucide-react";
import { useEffect } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useWordOfDay } from "../hooks/useQueries";
import { useTheme } from "../hooks/useTheme";

const sections = [
  {
    id: 1,
    title: "Learn English",
    icon: GraduationCap,
    desc: "Build a strong foundation",
    color: "bg-primary/10 text-primary",
    link: "/grammar",
  },
  {
    id: 2,
    title: "Grammar",
    icon: BookOpen,
    desc: "Tenses, articles & more",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    link: "/grammar",
  },
  {
    id: 3,
    title: "Pronunciation",
    icon: Volume1,
    desc: "Speak with clarity",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    link: "/pronunciation",
  },
  {
    id: 4,
    title: "Test Yourself",
    icon: PenLine,
    desc: "Quizzes & exercises",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    link: "/quiz",
  },
  {
    id: 5,
    title: "Dictionary",
    icon: Search,
    desc: "Meanings & examples",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    link: "/dictionary",
  },
  {
    id: 6,
    title: "Advanced Learning",
    icon: Star,
    desc: "Idioms & phrases",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    link: "/advanced",
  },
];

export default function DashboardPage() {
  const { actor } = useActor();
  const { data: wordOfDay, isLoading: wotdLoading } = useWordOfDay();
  const { identity } = useInternetIdentity();
  const { isDark, toggle } = useTheme();

  const principal = identity?.getPrincipal().toString();
  const initials = principal ? principal.slice(0, 2).toUpperCase() : "U";

  useEffect(() => {
    if (!actor) return;
    const initialized = localStorage.getItem("englishbook_initialized");
    if (!initialized) {
      actor
        .initializeSystem()
        .then(() => {
          localStorage.setItem("englishbook_initialized", "true");
        })
        .catch(() => {});
    }
  }, [actor]);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  return (
    <div className="animate-fade-up">
      <header className="gradient-primary text-primary-foreground px-4 pt-10 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-serif text-xl font-bold">Englishbook</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="darkmode.toggle"
              onClick={toggle}
              className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">{initials}</span>
            </div>
          </div>
        </div>
        <p className="text-primary-foreground/80 text-sm">
          Good day, learner! 🎓
        </p>
      </header>

      <div className="px-4 -mt-4">
        <div
          data-ocid="dashboard.word_of_day.card"
          className="bg-card rounded-2xl shadow-card p-5 mb-5 border border-border"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-3 py-1">
              Word of the Day
            </span>
          </div>

          {wotdLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : wordOfDay ? (
            <>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    {wordOfDay.word}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground text-sm font-mono">
                      {wordOfDay.phonetic}
                    </span>
                    <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full font-medium">
                      {wordOfDay.wordType}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => speak(wordOfDay.word)}
                  className="rounded-full w-9 h-9 p-0 flex-shrink-0 border-primary/30 text-primary"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-foreground mt-3 text-sm leading-relaxed">
                {wordOfDay.meaning}
              </p>
              <p className="text-muted-foreground mt-2 text-sm italic">
                "{wordOfDay.example}"
              </p>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              Word of the day coming soon...
            </p>
          )}
        </div>

        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          Learning Sections
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.id}
                to={section.link}
                data-ocid={`dashboard.section.item.${section.id}`}
                className="bg-card rounded-xl shadow-card p-4 border border-border hover:shadow-card-hover transition-all active:scale-95 block"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${section.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-sm">{section.title}</p>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                  {section.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-muted-foreground px-4">
        {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Built with love using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
