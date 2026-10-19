-- ==============================================================================
-- UNBROKEN (Unbroken Daily) Multi-Device Supabase Cloud Database Schema
-- "Clear Eyes, Clean Mind."
-- Full RLS Security, Automatic Profile Creation Trigger, & Realtime Pub
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT DEFAULT 'Disciple',
    pin_code TEXT DEFAULT NULL,
    assessment_score INTEGER DEFAULT 0,
    roadmap_days INTEGER DEFAULT 21,
    streak_start_date TIMESTAMPTZ DEFAULT NOW(),
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    disguise_title BOOLEAN DEFAULT FALSE,
    language TEXT DEFAULT 'en',
    theme TEXT DEFAULT 'dark',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. DAILY_LOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    victory BOOLEAN NOT NULL DEFAULT TRUE,
    urge_level INTEGER DEFAULT 0 CHECK (urge_level BETWEEN 0 AND 10),
    halt_triggers TEXT[] DEFAULT '{}',
    high_risk_hour INTEGER DEFAULT 22 CHECK (high_risk_hour BETWEEN 0 AND 23),
    notes TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_daily_log UNIQUE (user_id, log_date)
);

-- ------------------------------------------------------------------------------
-- 3. SAVED_VERSES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_verses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reference TEXT NOT NULL,
    text_en TEXT NOT NULL,
    text_ar TEXT DEFAULT '',
    personal_reflection TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Users can ONLY access & mutate their own data via auth.uid()
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_verses ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if re-running
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

CREATE POLICY "profiles_select_own"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_own"
    ON public.profiles FOR DELETE
    TO authenticated
    USING (auth.uid() = id);

-- Daily Logs RLS Policies
DROP POLICY IF EXISTS "daily_logs_select_own" ON public.daily_logs;
DROP POLICY IF EXISTS "daily_logs_insert_own" ON public.daily_logs;
DROP POLICY IF EXISTS "daily_logs_update_own" ON public.daily_logs;
DROP POLICY IF EXISTS "daily_logs_delete_own" ON public.daily_logs;

CREATE POLICY "daily_logs_select_own"
    ON public.daily_logs FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "daily_logs_insert_own"
    ON public.daily_logs FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_logs_update_own"
    ON public.daily_logs FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_logs_delete_own"
    ON public.daily_logs FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Saved Verses RLS Policies
DROP POLICY IF EXISTS "saved_verses_select_own" ON public.saved_verses;
DROP POLICY IF EXISTS "saved_verses_insert_own" ON public.saved_verses;
DROP POLICY IF EXISTS "saved_verses_update_own" ON public.saved_verses;
DROP POLICY IF EXISTS "saved_verses_delete_own" ON public.saved_verses;

CREATE POLICY "saved_verses_select_own"
    ON public.saved_verses FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "saved_verses_insert_own"
    ON public.saved_verses FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_verses_update_own"
    ON public.saved_verses FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_verses_delete_own"
    ON public.saved_verses FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. AUTOMATIC NEW USER PROFILE TRIGGER
-- Automatically creates a profile row in public.profiles on auth.users signup
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        display_name,
        assessment_score,
        roadmap_days,
        streak_start_date,
        current_streak,
        longest_streak,
        disguise_title,
        language,
        theme,
        updated_at,
        created_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1), 'Disciple'),
        0,
        21,
        NOW(),
        0,
        0,
        FALSE,
        'en',
        'dark',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 6. REALTIME REPLICATION (For Cross-Device Synchronized Listening)
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.daily_logs REPLICA IDENTITY FULL;
ALTER TABLE public.saved_verses REPLICA IDENTITY FULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'profiles'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'daily_logs'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_logs;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'saved_verses'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_verses;
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 7. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON public.profiles(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON public.daily_logs(user_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_logs_updated_at ON public.daily_logs(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_verses_user_created ON public.saved_verses(user_id, created_at DESC);
