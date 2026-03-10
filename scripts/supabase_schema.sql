-- SQL Schema for HTML5 Games Portal

-- Create the games table
CREATE TABLE public.games (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    category TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    "gameUrl" TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    views BIGINT DEFAULT 0 NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public reads
CREATE POLICY "Allow public read access to games" ON public.games
    FOR SELECT
    USING (true);

-- Create a policy to allow inserts only from authenticated service roles or anon users (for initial migration only)
CREATE POLICY "Allow anon insert (temporary for migration)" ON public.games
    FOR INSERT
    WITH CHECK (true);

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS games_slug_idx ON public.games (slug);
CREATE INDEX IF NOT EXISTS games_category_idx ON public.games (category);
CREATE INDEX IF NOT EXISTS games_views_idx ON public.games (views DESC);
CREATE INDEX IF NOT EXISTS games_created_at_idx ON public.games (created_at DESC);
