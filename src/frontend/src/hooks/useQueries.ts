import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Bookmark,
  BookmarkEntry,
  GrammarLesson,
  IdiomPhrase,
  PronunciationWord,
  QuizQuestion,
  WordOfDay,
} from "../backend.d";
import { useActor } from "./useActor";

export function useWordOfDay() {
  const { actor, isFetching } = useActor();
  return useQuery<WordOfDay | null>({
    queryKey: ["wordOfDay"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWordOfDay();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGrammarLessons() {
  const { actor, isFetching } = useActor();
  return useQuery<GrammarLesson[]>({
    queryKey: ["grammarLessons"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGrammarLessons();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePronunciationWords() {
  const { actor, isFetching } = useActor();
  return useQuery<PronunciationWord[]>({
    queryKey: ["pronunciationWords"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPronunciationWords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useQuizQuestions() {
  const { actor, isFetching } = useActor();
  return useQuery<QuizQuestion[]>({
    queryKey: ["quizQuestions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuizQuestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIdiomsPhrases() {
  const { actor, isFetching } = useActor();
  return useQuery<IdiomPhrase[]>({
    queryKey: ["idiomsPhrases"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getIdiomsPhrases();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookmarks() {
  const { actor, isFetching } = useActor();
  return useQuery<Bookmark[]>({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookmarks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBookmark() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: BookmarkEntry) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addBookmark(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function useRemoveBookmark() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookmarkId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.removeBookmark(bookmarkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}
