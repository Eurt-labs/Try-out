-- ====================================================================
-- TRY IT OUT — Supabase Database Schema
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor)
-- ====================================================================

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT,
    avatar_url TEXT,
    tier TEXT DEFAULT 'Standard Member',
    preferences JSONB DEFAULT '{"preferredCategory": "All", "genderPreference": "All Styles", "notifications": true, "highQualityRender": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. SAVED LOOKS TABLE
CREATE TABLE IF NOT EXISTS public.saved_looks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    outfit_id TEXT NOT NULL,
    outfit_name TEXT NOT NULL,
    outfit_category TEXT,
    outfit_image TEXT,
    result_image TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Saved Looks
ALTER TABLE public.saved_looks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved looks." 
ON public.saved_looks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved looks." 
ON public.saved_looks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved looks." 
ON public.saved_looks FOR DELETE USING (auth.uid() = user_id);

-- 3. USER PHOTOS TABLE
CREATE TABLE IF NOT EXISTS public.user_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    photo_url TEXT NOT NULL,
    asset_id TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for User Photos
ALTER TABLE public.user_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own photos." 
ON public.user_photos FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own photos." 
ON public.user_photos FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos." 
ON public.user_photos FOR DELETE USING (auth.uid() = user_id);

-- 4. TRIGGER FOR AUTO-CREATING USER PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, avatar_url)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

