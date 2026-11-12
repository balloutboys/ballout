# Ballout Boys

Next.js 15 site that lists and serves published artifacts from Supabase, deployed on Vercel.

## Stack
- **Next.js** (App Router, TypeScript, Tailwind)
- **Supabase** – `artifacts` table (see `supabase/migrations/0001_artifacts.sql`)
- **Vercel** – auto-deploys every push to `main`

## Setup

1. **Supabase**: create a project → SQL Editor → run `supabase/migrations/0001_artifacts.sql`.
2. **Vercel**: Add New → Project → import this GitHub repo. Then add the Supabase integration
   (Vercel → Integrations → Supabase) or set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` manually.
3. **Local dev**:
   ```bash
   cp .env.example .env.local   # fill in values
   npm install
   npm run dev
   ```

## Publishing an artifact
Insert a row in Supabase (Table Editor or SQL):
```sql
insert into artifacts (slug, title, description, url, published)
values ('first-drop', 'First Drop', 'Our first artifact', 'https://claude.ai/...', true);
```
It shows up at `/` and `/artifacts/first-drop`.
