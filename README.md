# Explore With Kaira

Standalone Next.js app for `explorewithkaira.com`.

## Stack

- Next.js App Router
- Supabase for content/auth/storage
- Replicate for Kaira editorial images
- Gemini/Imagen for destination imagery
- Google Search Console and GA4 analytics ingestion

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm test`

## Environment

Copy `.env.example` to `.env.local` and fill in the required values.

Key variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SITE_ID`
- `NEXT_PUBLIC_BASE_URL`
- `CRON_SECRET`
- `GA4_PROPERTY_ID`
- `GOOGLE_SERVICE_ACCOUNT_BASE64`
- `GEMINI_API_KEY`
- `REPLICATE_API_TOKEN`
- `KAIRA_MODEL_VERSION`

## Notes

This repo was extracted from the old Mugon monorepo so Kaira can be developed and deployed independently.
