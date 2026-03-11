-- Script to update the broken Unsplash image to a working GamePix image.
-- Run this in your Supabase SQL Editor.

UPDATE public.articles
SET image_url = 'https://img.gamepix.com/games/madalin-stunt-cars-2/cover/madalin-stunt-cars-2.png'
WHERE slug = 'top-10-car-games';
