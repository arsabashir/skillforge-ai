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

1. Create a Supabase project, enter its URL/anon key/service-role key in `.env.local`, then run `supabase/schema.sql` in its SQL editor.
2. Enable Email OTP in Supabase Auth to use the built-in sign-in panel.
3. Configure a production deployment target and replace the in-memory rate limiter with a shared store such as Upstash Redis.
