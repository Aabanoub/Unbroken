-- ==============================================================================
-- UNBROKEN: Recovery PWA — Supabase PostgreSQL Database Schema
-- "Clear Eyes, Clean Mind."
-- 100% Free Tier Compatible with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
-- Holds the user's recovery profile, clinical baseline, goals, and privacy PIN
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_name TEXT DEFAULT 'Disciple',
    onboarding_score INTEGER DEFAULT 0,
    current_addiction_index NUMERIC(5,2) DEFAULT 0.0,
    addiction_tier TEXT DEFAULT 'Level 1 — Mild Habitual Loop',
    goal_days INTEGER DEFAULT 21,
    streak_start_timestamp TIMESTAMPTZ DEFAULT NOW(),
    longest_streak_days INTEGER DEFAULT 0,
    urges_defeated_count INTEGER DEFAULT 0,
    pin_code TEXT DEFAULT NULL,
    disguise_title BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DAILY_LOGS TABLE
-- Tracks daily check-ins, relapse/victory events, HALT triggers, and reflections
CREATE TABLE IF NOT EXISTS public.daily_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('clean', 'urge_defeated', 'relapse')),
    urge_intensity INTEGER CHECK (urge_intensity BETWEEN 1 AND 10),
    triggers TEXT[] DEFAULT '{}',
    time_of_day TEXT CHECK (time_of_day IN ('Morning', 'Afternoon', 'Evening', 'Late Night 11PM-3AM', 'Late Night')),
    journal_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_daily_log UNIQUE (user_id, log_date)
);

-- 3. SAVED_VERSES TABLE
-- User's saved NKJV Scripture vault and personal meditative reflections
CREATE TABLE IF NOT EXISTS public.saved_verses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reference TEXT NOT NULL,
    verse_text TEXT NOT NULL,
    personal_reflection TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_verses ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage their own profile
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Daily Logs policies
CREATE POLICY "Users can view their own daily logs"
    ON public.daily_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily logs"
    ON public.daily_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily logs"
    ON public.daily_logs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily logs"
    ON public.daily_logs FOR DELETE
    USING (auth.uid() = user_id);

-- Saved Verses policies
CREATE POLICY "Users can view their own saved verses"
    ON public.saved_verses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved verses"
    ON public.saved_verses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved verses"
    ON public.saved_verses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved verses"
    ON public.saved_verses FOR DELETE
    USING (auth.uid() = user_id);

-- Helpful Indexing for fast query speeds on free tier
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON public.daily_logs(user_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_saved_verses_user ON public.saved_verses(user_id, created_at DESC);
