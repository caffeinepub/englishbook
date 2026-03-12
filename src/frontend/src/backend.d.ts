import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BookmarkEntry {
    bookmarkType: BookmarkType;
    meaning: string;
    word: string;
}
export interface IdiomPhrase {
    id: bigint;
    exampleSentence: string;
    meaning: string;
    term: string;
    category: IdiomCategory;
    usageExplanation: string;
}
export interface GrammarLesson {
    id: bigint;
    title: string;
    explanation: string;
    practiceQuestions: Array<PracticeQuestion>;
    category: string;
    examples: Array<string>;
}
export interface QuizQuestion {
    id: bigint;
    question: string;
    explanation: string;
    correctAnswer: string;
    questionType: QuestionType;
    options: Array<string>;
}
export interface PronunciationWord {
    id: bigint;
    word: string;
    category: string;
    phonetic: string;
}
export interface WordOfDay {
    meaning: string;
    word: string;
    example: string;
    phonetic: string;
    wordType: string;
}
export interface Bookmark {
    id: bigint;
    bookmarkType: BookmarkType;
    meaning: string;
    word: string;
}
export interface PracticeQuestion {
    question: string;
    explanation: string;
    correctAnswer: string;
    options: Array<string>;
}
export interface UserProfile {
    name: string;
}
export enum BookmarkType {
    word = "word",
    phrase = "phrase"
}
export enum IdiomCategory {
    expression = "expression",
    idiom = "idiom",
    phrase = "phrase"
}
export enum QuestionType {
    fillBlank = "fillBlank",
    sentenceCorrection = "sentenceCorrection",
    multipleChoice = "multipleChoice"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBookmark(entry: BookmarkEntry): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getBookmarks(): Promise<Array<Bookmark>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGrammarLessons(): Promise<Array<GrammarLesson>>;
    getIdiomsPhrases(): Promise<Array<IdiomPhrase>>;
    getPronunciationWords(): Promise<Array<PronunciationWord>>;
    getQuizQuestions(): Promise<Array<QuizQuestion>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWordOfDay(): Promise<WordOfDay | null>;
    initializeSystem(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    removeBookmark(bookmarkId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setWordOfDay(newWord: WordOfDay): Promise<void>;
}
