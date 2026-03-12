import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookMarked,
  BookOpen,
  Home,
  MoreHorizontal,
  PenLine,
  Search,
  Star,
  Volume2,
} from "lucide-react";
import { useState } from "react";

export default function BottomNav() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [sheetOpen, setSheetOpen] = useState(false);

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-card/95 backdrop-blur-md border-t border-border z-50 safe-bottom">
      <div className="flex items-center justify-around h-16">
        <Link
          to="/dashboard"
          data-ocid="nav.home.link"
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${isActive("/dashboard") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link
          to="/grammar"
          data-ocid="nav.grammar.link"
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${isActive("/grammar") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium">Grammar</span>
        </Link>

        <Link
          to="/quiz"
          data-ocid="nav.quiz.link"
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${isActive("/quiz") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <PenLine className="w-5 h-5" />
          <span className="text-[10px] font-medium">Quiz</span>
        </Link>

        <Link
          to="/advanced"
          data-ocid="nav.advanced.link"
          className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${isActive("/advanced") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Star className="w-5 h-5" />
          <span className="text-[10px] font-medium">Advanced</span>
        </Link>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              data-ocid="nav.more.link"
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${isActive("/dictionary") || isActive("/pronunciation") || isActive("/bookmarks") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="rounded-t-2xl max-w-[480px] mx-auto"
          >
            <SheetHeader className="mb-4">
              <SheetTitle className="font-serif text-lg">
                More Sections
              </SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-3 pb-4">
              <Link
                to="/dictionary"
                onClick={() => setSheetOpen(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Search className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Dictionary</span>
              </Link>
              <Link
                to="/pronunciation"
                onClick={() => setSheetOpen(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Volume2 className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Pronunciation</span>
              </Link>
              <Link
                to="/bookmarks"
                onClick={() => setSheetOpen(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <BookMarked className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">Bookmarks</span>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
