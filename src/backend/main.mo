import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Include Prefab Authorization System
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type Bookmark = {
    id : Nat;
    word : Text;
    meaning : Text;
    bookmarkType : BookmarkType;
  };

  public type BookmarkType = {
    #word;
    #phrase;
  };

  public type WordOfDay = {
    word : Text;
    meaning : Text;
    phonetic : Text;
    example : Text;
    wordType : Text;
  };

  public type GrammarLesson = {
    id : Nat;
    title : Text;
    category : Text;
    explanation : Text;
    examples : [Text];
    practiceQuestions : [PracticeQuestion];
  };

  public type PracticeQuestion = {
    question : Text;
    options : [Text];
    correctAnswer : Text;
    explanation : Text;
  };

  public type PronunciationWord = {
    id : Nat;
    word : Text;
    phonetic : Text;
    category : Text;
  };

  public type QuizQuestion = {
    id : Nat;
    questionType : QuestionType;
    question : Text;
    options : [Text];
    correctAnswer : Text;
    explanation : Text;
  };

  public type QuestionType = {
    #multipleChoice;
    #fillBlank;
    #sentenceCorrection;
  };

  public type IdiomPhrase = {
    id : Nat;
    term : Text;
    meaning : Text;
    exampleSentence : Text;
    usageExplanation : Text;
    category : IdiomCategory;
  };

  public type IdiomCategory = {
    #idiom;
    #phrase;
    #expression;
  };

  public type BookmarkEntry = {
    word : Text;
    meaning : Text;
    bookmarkType : BookmarkType;
  };

  public type UserProfile = {
    name : Text;
  };

  // Custom Comparators for Sorting
  module GrammarLessonCompare {
    public func compare(a : GrammarLesson, b : GrammarLesson) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module PronunciationWordCompare {
    public func compare(a : PronunciationWord, b : PronunciationWord) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module QuizQuestionCompare {
    public func compare(a : QuizQuestion, b : QuizQuestion) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module IdiomPhraseCompare {
    public func compare(a : IdiomPhrase, b : IdiomPhrase) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  // Persistent Storage
  var wordOfDay : ?WordOfDay = null;
  let grammarLessons = Map.empty<Nat, GrammarLesson>();
  let pronunciationWords = Map.empty<Nat, PronunciationWord>();
  let quizQuestions = Map.empty<Nat, QuizQuestion>();
  let idiomPhrases = Map.empty<Nat, IdiomPhrase>();
  let userBookmarks = Map.empty<Principal, [Bookmark]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Initialization with sample data
  public shared ({ caller }) func initializeSystem() : async () {
    // Admin only
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can initialize data");
    };
    // Seed grammar lessons
    let lesson1 : GrammarLesson = {
      id = 1;
      title = "Nouns";
      category = "Parts of Speech";
      explanation = "A noun is a person, place, thing, or idea.";
      examples = ["dog", "city", "happiness"];
      practiceQuestions = [{
        question = "Which word is a noun?";
        options = ["run", "city", "happy", "quickly"];
        correctAnswer = "city";
        explanation = "City is a place, which makes it a noun.";
      }];
    };
    grammarLessons.add(1, lesson1);

    // Seed pronunciation words
    let word1 : PronunciationWord = {
      id = 1;
      word = "schedule";
      phonetic = "/ˈʃɛd.juːl/";
      category = "Common Words";
    };
    pronunciationWords.add(1, word1);

    // Seed quiz questions
    let question1 : QuizQuestion = {
      id = 1;
      questionType = #multipleChoice;
      question = "Choose the correct verb tense: 'She _____ to the store yesterday.'";
      options = ["goes", "went", "going", "gone"];
      correctAnswer = "went";
      explanation = "'Yesterday' indicates past tense, so 'went' is correct.";
    };
    quizQuestions.add(1, question1);

    // Seed idioms/phrases
    let idiom1 : IdiomPhrase = {
      id = 1;
      term = "Break a leg";
      meaning = "Good luck";
      exampleSentence = "Before the play, she wished him to break a leg.";
      usageExplanation = "Often used to wish someone good luck, especially in performances.";
      category = #idiom;
    };
    idiomPhrases.add(1, idiom1);

    // Set default Word of the Day
    wordOfDay := ?{
      word = "serendipity";
      meaning = "The occurrence of happy or beneficial events by chance";
      phonetic = "/ˌsɛr.ənˈdɪp.ɪ.ti/";
      example = "finding $10 in your old coat pocket";
      wordType = "noun";
    };
  };

  // Bookmarks - User only
  public shared ({ caller }) func addBookmark(entry : BookmarkEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add bookmarks");
    };
    let currentBookmarks = switch (userBookmarks.get(caller)) {
      case (null) { [] };
      case (?existing) { existing };
    };

    let newBookmark : Bookmark = {
      id = currentBookmarks.size();
      word = entry.word;
      meaning = entry.meaning;
      bookmarkType = entry.bookmarkType;
    };

    userBookmarks.add(caller, currentBookmarks.concat([newBookmark]));
  };

  public query ({ caller }) func getBookmarks() : async [Bookmark] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve bookmarks");
    };
    switch (userBookmarks.get(caller)) {
      case (null) { [] };
      case (?bookmarks) { bookmarks };
    };
  };

  public shared ({ caller }) func removeBookmark(bookmarkId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove bookmarks");
    };
    let currentBookmarks = switch (userBookmarks.get(caller)) {
      case (null) { Runtime.trap("Bookmark not found") };
      case (?bookmarks) { bookmarks };
    };

    let filteredBookmarks = currentBookmarks.filter(
      func(b) { b.id != bookmarkId }
    );
    userBookmarks.add(caller, filteredBookmarks);
  };

  // Word of the Day - Read: anyone, Update: admin only
  public query func getWordOfDay() : async ?WordOfDay {
    wordOfDay;
  };

  public shared ({ caller }) func setWordOfDay(newWord : WordOfDay) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update Word of the Day");
    };
    wordOfDay := ?newWord;
  };

  // Getters for seeded data - Public access (anyone including guests)
  public query func getGrammarLessons() : async [GrammarLesson] {
    grammarLessons.values().toArray().sort();
  };

  public query func getPronunciationWords() : async [PronunciationWord] {
    pronunciationWords.values().toArray().sort();
  };

  public query func getQuizQuestions() : async [QuizQuestion] {
    quizQuestions.values().toArray().sort();
  };

  public query func getIdiomsPhrases() : async [IdiomPhrase] {
    idiomPhrases.values().toArray().sort();
  };
};
