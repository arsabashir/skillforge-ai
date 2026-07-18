# SkillForge AI

An App Router starter for personalized learning roadmaps, with extension points for adaptive quizzes, weak-spot tracking, an AI tutor, and Supabase persistence.

## Start locally

1. Copy `.env.example` to `.env.local`. An API key is optional for local UI testing: without one, SkillForge uses deterministic mock roadmaps and quizzes.
2. Run `npm install`.
3. Run `npm run dev` and open `http://localhost:3000`.

`OPENAI_MODEL` defaults to `gpt-5.6`; change it in `.env.local` if your account uses a different model identifier. Set `OPENAI_API_KEY` to automatically use the real API instead of mock data.

## Structure

- `app/` — pages and server routes
- `components/` — UI components
- `lib/` — shared types, validation, and API helpers
- `services/` — provider-facing business logic
- `lib/supabase/` — Supabase client placeholders

## Next steps

- Add Supabase auth plus `learning_roadmaps`, `quiz_attempts`, and `concept_mastery` tables.
- Persist generated roadmaps through `services/roadmap-service.ts` after a user is authenticated.
- Implement `/api/quizzes` using a selected roadmap module and write results to `concept_mastery`.
- Build `/api/tutor` to retrieve weak concepts and pass them as bounded learning context.
