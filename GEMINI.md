# Project Context & Architectural Rules: Unbroken PWA

> **Instruction for AI Agent (Google Antigravity IDE):** Always read and strictly adhere to the specifications, architecture, and constraints defined in this file before generating, refactoring, or debugging any code in this workspace.

---

## 1. Branding & Privacy Identity
- **App Name:** Unbroken
- **Slogan:** "Clear Eyes, Clean Mind."
- **Thematic Anchor Verse:** Matthew 6:22 (NKJV)
- **Discreet Privacy Title (PWA Manifest & Browser Tab):** `"Unbroken Daily"`
- **Privacy Lock:** 4-digit PIN lock stored in the user's profile (`pin_code`) with local cache fallback for instant lock-screen verification.
- **Target Audience & Tone:** Christian teen recovery app. The UI/UX must be encouraging, modern, scientific, dignity-preserving, and anti-despair (focusing on growth and grace rather than shame).

---

## 2. 100% Free ($0) Tech Stack & Build Constraints
- **Framework:** Next.js (App Router, TypeScript, React)
- **Styling & Motion:** Tailwind CSS, Framer Motion, Lucide React Icons
- **Data Visualization:** Recharts
- **Hosting & CI/CD:** GitHub + Vercel
- **Database & Auth:** Supabase Free Tier (PostgreSQL + Supabase Email/Password Auth + Row Level Security + Realtime) paired with an Optimistic `localStorage` fallback layer.
- **Strict Vercel Build Safety Rules:**
  1. Every component using React hooks (`useState`, `useEffect`, `useContext`), browser APIs (`window`, `localStorage`, `navigator`), Framer Motion, or Recharts **MUST** declare `"use client"` at line 1.
  2. Every `localStorage` or `window` access **MUST** be guarded with `typeof window !== "undefined"`.
  3. Keep `ignoreBuildErrors: true` in `next.config.mjs` (or `next.config.ts`) and ensure fallback values exist if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are temporarily absent at build time.

---

## 3. Scripture & Bilingual Verse Architecture
- **Primary Translation:** New King James Version (NKJV).
- **Local Seed File:** `src/data/nkjv-verses.ts` (offline-first curated recovery and encouragement verses).
- **Remote API:** Free keyless Bolls Life Bible API:
  - Endpoint format: `https://bolls.life/get-verse/NKJV/{book}/{chapter}/{verse}/`
- **Core Anchor Verse (Proverbs 24:16):**
  - Must support both English (NKJV) and Arabic (SVD: `"لأَنَّ الصِّدِّيقَ يَسْقُطُ سَبْعَ مَرَّاتٍ وَيَقُومُ..."`).

---

## 4. Core Features & Functional Requirements
1. **8-Question Scientific Onboarding Assessment:**
   - Adapted from BPS / CPUI-9 clinical scales (score range: `0–32`).
   - Automatically assigns a personalized **21-Day**, **40-Day**, or **90-Day** recovery roadmap based on severity score.
2. **Home Dashboard:**
   - Circular Streak Ring & Biblical Milestone Ranks (Day 1 to Day 90).
   - Daily Check-In modal/card (Victory status, Urge level `1–10`, HALT triggers, High-risk hour `0–23`, Notes).
   - **30-Day Victory Rate (%):** Anti-despair metric showing the percentage of victorious days over the last 30 days so a single relapse never erases overall progress.
3. **Analytics Tab:**
   - Dynamic Addiction Severity Index.
   - Brain Neuroplasticity Reboot timeline.
   - Urge vs. Streak Area Chart (Recharts).
   - HALT Trigger (Hungry, Angry, Lonely, Tired) Bar Chart.
   - High-Risk Time-of-Day Heatmap.
4. **Center SOS "Urge Rescue" Button:**
   - 60-second Box Breathing animated timer (4s inhale, 4s hold, 4s exhale, 4s hold).
   - Dynamic NKJV Scripture card (with English/Arabic support for key verses).
   - Physical pattern-interrupt checklist.

---

## 5. Multi-Device Zero-Delay Storage Architecture

All data persistence across the application **MUST** use the centralized storage engine (`src/lib/storage.ts` + `src/context/StorageContext.tsx`). Never write scattered raw `localStorage` calls directly inside UI components.

### 5.1 Database Schema (`supabase/schema.sql`)
All tables enforce Row Level Security (`auth.uid() = id` or `auth.uid() = user_id`):
- **`profiles`**:
  - `id` (UUID, PK, references `auth.users(id)` ON DELETE CASCADE)
  - `email` (TEXT)
  - `pin_code` (TEXT, 4-digit privacy lock)
  - `assessment_score` (INT, 0–32)
  - `roadmap_days` (INT, 21 | 40 | 90)
  - `streak_start_date` (TIMESTAMPTZ)
  - `current_streak` (INT)
  - `longest_streak` (INT)
  - `updated_at` (TIMESTAMPTZ, default `now()`)
- **`daily_logs`**:
  - `id` (UUID, PK, default `gen_random_uuid()`)
  - `user_id` (UUID, references `auth.users(id)` ON DELETE CASCADE)
  - `log_date` (DATE, unique constraint on `(user_id, log_date)`)
  - `victory` (BOOLEAN)
  - `urge_level` (INT, 1–10)
  - `halt_triggers` (TEXT[])
  - `high_risk_hour` (INT, 0–23)
  - `notes` (TEXT)
  - `updated_at` (TIMESTAMPTZ, default `now()`)
- **`saved_verses`**:
  - `id` (UUID, PK, default `gen_random_uuid()`)
  - `user_id` (UUID, references `auth.users(id)` ON DELETE CASCADE)
  - `reference` (TEXT)
  - `text_en` (TEXT)
  - `text_ar` (TEXT)
  - `created_at` (TIMESTAMPTZ, default `now()`)

### 5.2 Four-Phase Sync Execution Algorithm
1. **Authentication (`src/components/AuthGate.tsx`):**
   - Users authenticate via Email + Password (`supabase.auth.signUp` / `signInWithPassword`).
   - Upon sign-in on any device, fetch the user's `profiles`, `daily_logs`, and `saved_verses` from Supabase and reconcile with local cache using `updated_at` timestamps.
2. **Optimistic Local Write (0ms UI Latency):**
   - Every mutation (`saveProfile`, `saveDailyLog`, `saveVerse`, `deleteVerse`, `resetStreak`) updates React state and `localStorage` synchronously with a fresh `updated_at: new Date().toISOString()` timestamp before any network request finishes.
3. **Continuous Non-Blocking Cloud Upsert & Offline Queue:**
   - Immediately after the optimistic write, execute an async background `.upsert()` to Supabase.
   - If the device is offline or the request fails, push the mutation payload into `localStorage` under `unbroken_sync_queue`.
   - Automatically flush `unbroken_sync_queue` when `window` fires the `'online'` or `'focus'` event.
4. **Realtime Multi-Device Sync:**
   - Subscribe to `postgres_changes` filtered by `user_id=eq.${user.id}`.
   - When an incoming payload has a newer `updated_at` timestamp than the local state, merge it immediately into `localStorage` and React state.

---

## 6. Code Style & File Structure Conventions
- `src/lib/supabase.ts` — SSR-safe Supabase client singleton.
- `src/lib/storage.ts` — Optimistic storage engine, offline sync queue, and conflict resolution helpers.
- `src/context/StorageContext.tsx` — Global provider exposing `profile`, `dailyLogs`, `savedVerses`, `syncStatus` (`'synced' | 'syncing' | 'offline'`), and action methods via `useStorage()`.
- `src/components/AuthGate.tsx` — Discreet "Unbroken Daily" Email + Password authentication screen and 4-digit PIN lock guard.
- `src/data/nkjv-verses.ts` — Local NKJV + Arabic SVD scripture dataset.