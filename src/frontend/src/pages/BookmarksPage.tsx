import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookMarked, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BookmarkType } from "../backend.d";
import { useBookmarks, useRemoveBookmark } from "../hooks/useQueries";

export default function BookmarksPage() {
  const navigate = useNavigate();
  const { data: bookmarks, isLoading } = useBookmarks();
  const removeBookmark = useRemoveBookmark();

  const words = bookmarks?.filter((b) => b.bookmarkType === BookmarkType.word);
  const phrases = bookmarks?.filter(
    (b) => b.bookmarkType === BookmarkType.phrase,
  );

  const handleRemove = (id: bigint) => {
    removeBookmark.mutate(id, {
      onSuccess: () => toast.success("Bookmark removed"),
    });
  };

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
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5" />
            <h1 className="font-serif text-xl font-bold">Bookmarks</h1>
          </div>
        </div>
      </header>

      <div className="px-4 py-4">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        )}

        {!isLoading && !bookmarks?.length && (
          <div data-ocid="bookmarks.empty_state" className="text-center py-16">
            <div className="text-5xl mb-4">📌</div>
            <p className="font-serif text-lg font-bold mb-2">
              No bookmarks yet
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              Save words and phrases while learning
            </p>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/dictionary" })}
            >
              Search Dictionary
            </Button>
          </div>
        )}

        {words && words.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Words
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="space-y-2">
              {words.map((bookmark, i) => (
                <div
                  key={String(bookmark.id)}
                  data-ocid={`bookmarks.item.${i + 1}`}
                  className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border shadow-card"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{bookmark.word}</p>
                    <p className="text-muted-foreground text-xs truncate mt-0.5">
                      {bookmark.meaning}
                    </p>
                  </div>
                  <Button
                    data-ocid={`bookmarks.delete_button.${i + 1}`}
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(bookmark.id)}
                    disabled={removeBookmark.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {phrases && phrases.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Phrases & Lessons
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="space-y-2">
              {phrases.map((bookmark, i) => {
                const idx = (words?.length || 0) + i + 1;
                return (
                  <div
                    key={String(bookmark.id)}
                    data-ocid={`bookmarks.item.${idx}`}
                    className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border shadow-card"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{bookmark.word}</p>
                      <p className="text-muted-foreground text-xs truncate mt-0.5">
                        {bookmark.meaning}
                      </p>
                    </div>
                    <Button
                      data-ocid={`bookmarks.delete_button.${idx}`}
                      size="sm"
                      variant="ghost"
                      className="w-8 h-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(bookmark.id)}
                      disabled={removeBookmark.isPending}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
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
