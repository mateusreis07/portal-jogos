'use server';

import { supabase } from '@/lib/supabaseClient';
import { Game } from '@/lib/types/game';
import translationsData from '@/data/translations.json';

/**
 * Server action to load the next game for infinite scroll functionality.
 * It fetches one popular game from the same category that hasn't been loaded yet.
 */
export async function loadNextGame(category: string, excludeIds: string[], locale: string): Promise<Game | null> {
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
    createdAt: data.created_at,
    views: Number(data.views) || 0,
  };
}
