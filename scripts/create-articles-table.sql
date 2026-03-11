-- Script to create the `articles` table for SEO-focused landing pages.
-- Run this in your Supabase SQL Editor.

CREATE TABLE public.articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  meta_description TEXT,
  content TEXT NOT NULL, -- The long-form SEO content (HTML or Markdown)
  target_tag TEXT NOT NULL, -- The tag used to fetch related games (e.g., 'car-games')
  image_url TEXT, -- Optional header/cover image
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a unique constraint to ensure no duplicate slugs per locale
ALTER TABLE public.articles ADD CONSTRAINT unique_slug_per_locale UNIQUE (slug, locale);

-- Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read active articles
CREATE POLICY "Public articles are viewable by everyone."
  ON public.articles FOR SELECT
  USING (published = true);

-- Create policy to allow authenticated admins to insert/update (optional for future dashboard)
CREATE POLICY "Authenticated users can insert articles"
  ON public.articles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update articles"
  ON public.articles FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ==========================================
-- DUMMY DATA FOR TESTING
-- ==========================================
INSERT INTO public.articles (slug, locale, title, meta_description, content, target_tag, image_url)
VALUES
(
  'top-10-car-games',
  'pt-BR',
  'Top 10 Jogos de Carros Grátis Online',
  'Descubra os melhores jogos de corrida e carros online. Jogue drift, rali e estacionamento grátis sem baixar nada!',
  '<h2>Os Melhores Jogos de Carros na Internet</h2><p>Se você é fã de alta velocidade e adrenalina, esta lista é para você. Separamos os melhores jogos de corrida e pilotagem do momento, disponíveis diretamente no seu navegador, sem necessidade de download ou instalação pesada.</p><h3>Diversidade nas Pistas</h3><p>Desde rali extremo na lama até corridas de drift em metrópoles neon, a tag <b>car-games</b> oferece experiências para todos os gostos. Melhore seus reflexos e compita para ser o rei das pistas.</p><h3>Vantagens de Jogar no ArcadeHub</h3><p>Nossos jogos HTML5 são super leves, carregam rápido e funcionam perfeitamente no PC ou no Celular.</p>',
  'car-games',
  'https://images.unsplash.com/photo-1547396652-320c22fa15c6?auto=format&fit=crop&q=80&w=1600'
),
(
  'top-10-car-games',
  'en',
  'Top 10 Free Online Car Games',
  'Discover the best racing and car games online. Play drift, rally, and parking games for free with no download!',
  '<h2>The Best Car Games on the Internet</h2><p>If you love high speed and adrenaline, this list is for you. We gathered the best racing and driving games available directly in your browser, no heavy downloads needed.</p><h3>Diversity on the Tracks</h3><p>From extreme mud rallies to neon city drfits, our <b>car-games</b> tag offers experiences for everyone. Improve your reflexes and compete to be the king of the track.</p><h3>Why Play on ArcadeHub?</h3><p>Our HTML5 games are super lightweight, load fast and work perfectly on both PC and Mobile.</p>',
  'car-games',
  'https://images.unsplash.com/photo-1547396652-320c22fa15c6?auto=format&fit=crop&q=80&w=1600'
);
