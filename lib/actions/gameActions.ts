'use server';

import { supabase } from '@/lib/supabaseClient';
import { Game } from '@/lib/types/game';
import translationsData from '@/data/translations.json';

/**
 * Server action to load the next game for infinite scroll functionality.
 * It uses the advanced related games logic prioritizing tags over pure category.
 */
export async function loadNextGame(category: string, excludeIds: string[], locale: string, tags?: string[]): Promise<Game | null> {
  // Try finding by tags first if available
  if (tags && tags.length > 0) {
    const topTags = tags.slice(0, 3);
    const orQuery = topTags.map(t => `tags.cs.{${t}}`).join(',');

    if (orQuery) {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .or(orQuery)
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .order('views', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        return applyTranslationToRow(data, locale);
      }
    }
  }

  // Fallback to finding by category
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('category', category)
    .not('id', 'in', `(${excludeIds.join(',')})`)
    .order('views', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    if (error?.code !== 'PGRST116') { // PGRST116 is the code for "no rows returned" by single()
      console.error('Error fetching next game for infinite scroll:', error);
    }
    return null;
  }

  return applyTranslationToRow(data, locale);
}

function applyTranslationToRow(data: any, locale: string): Game {
  const langKey = locale === 'pt-BR' ? 'pt' : locale;
  const translation = (translationsData as any)[data.id]?.[langKey] || (translationsData as any)[data.id]?.en || { description: data.description, instructions: data.instructions };

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: translation.description,
    instructions: translation.instructions,
    category: data.category,
    thumbnail: data.thumbnail,
    gameUrl: data.gameUrl,
    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
    createdAt: data.created_at,
    views: Number(data.views) || 0,
  };
}
