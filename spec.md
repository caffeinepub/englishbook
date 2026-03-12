# Englishbook

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- User registration and login (email-based via authorization component)
- Home dashboard with 6 section cards: Learn English, Grammar, Pronunciation, Test Yourself, Dictionary Search, Advanced Learning
- Dictionary Search: search bar, word results with meaning, phonetic spelling, word type, example sentences, audio pronunciation button (uses Web Speech API)
- Grammar section: structured lessons (Parts of Speech, Tenses, Articles, Prepositions, Active/Passive Voice, Direct/Indirect Speech) each with explanation, examples, practice questions
- Pronunciation section: word list, phonetic display, audio playback via Web Speech API
- Test Yourself section: multiple-choice, fill-in-the-blanks, sentence correction quizzes; post-quiz score and answer review
- Advanced Learning section: idioms, phrases, expressions with meaning, example sentence, usage explanation; search bar
- Bookmarks: save favorite words/phrases, view bookmark list
- Word of the Day feature on home dashboard
- Dark mode toggle
- Mobile-first responsive layout

### Modify
- None

### Remove
- None

## Implementation Plan
1. Use authorization component for user auth (email registration/login)
2. Backend: store bookmarks per user, word of the day, grammar lessons, pronunciation words, quiz questions, idioms/phrases - all as stable data with CRUD for bookmarks
3. Frontend: multi-page React app with bottom navigation; pages for Dashboard, Dictionary, Grammar, Pronunciation, Quiz, Advanced Learning, Bookmarks
4. Dictionary uses Free Dictionary API via HTTP outcalls or frontend fetch
5. Audio pronunciation via Web Speech API (SpeechSynthesis)
6. Dark mode via Tailwind dark class + localStorage preference
7. All content (grammar lessons, quiz questions, idioms) seeded as static data in backend
