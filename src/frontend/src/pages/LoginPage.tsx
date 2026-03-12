import { Button } from "@/components/ui/button";
import { BookOpen, Globe, Loader2 } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="gradient-primary text-primary-foreground px-6 pt-16 pb-12 flex-shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold">Englishbook</h1>
            <p className="text-primary-foreground/80 text-sm">
              Master English with confidence
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xl font-semibold">
            Your English learning journey starts here
          </p>
          <p className="text-primary-foreground/75 text-sm leading-relaxed">
            Grammar, vocabulary, pronunciation and more in one place.
          </p>
        </div>
      </div>

      <div className="px-6 py-6 grid grid-cols-2 gap-3">
        {[
          { icon: "📖", label: "Grammar Lessons", desc: "Structured lessons" },
          { icon: "🔊", label: "Pronunciation", desc: "Audio support" },
          { icon: "🧠", label: "Quizzes", desc: "Test yourself" },
          { icon: "⭐", label: "Idioms & Phrases", desc: "Advanced English" },
        ].map((f) => (
          <div
            key={f.label}
            className="bg-card rounded-xl p-4 shadow-card border border-border"
          >
            <div className="text-2xl mb-1">{f.icon}</div>
            <p className="font-semibold text-sm">{f.label}</p>
            <p className="text-muted-foreground text-xs">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="px-6 pb-8 flex-1">
        <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-5">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "login" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab("register")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "register" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"}`}
          >
            Register
          </button>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6 space-y-4 border border-border">
          <div className="text-center">
            <h2 className="font-serif text-xl font-bold">
              {tab === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {tab === "login"
                ? "Sign in with your Internet Identity"
                : "Register with your Internet Identity"}
            </p>
          </div>

          <Button
            className="w-full h-12 text-base font-semibold rounded-xl"
            onClick={login}
            disabled={isLoggingIn || isInitializing}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Continue with Internet Identity
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Secure, decentralized authentication. No passwords needed.
          </p>
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-muted-foreground">
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
