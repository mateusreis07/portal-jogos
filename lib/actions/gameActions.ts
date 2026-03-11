'use server';

import { supabase } from '@/lib/supabaseClient';
import { Game } from '@/lib/types/game';
import { gameService } from '@/lib/services/gameService';

/**
 * Server action to load the next game for infinite scroll functionality.
 * It fetches one popular game from the same category that hasn't been loaded yet.
 */
export async function loadNextGame(category: string, excludeIds: string[]): Promise<Game | null> {
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

  // We must map it so it matches the frontend Game interface (camelCase vs snake_case)
  // Re-using the private mapper logic from gameService by importing and relying on its signature structure
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    instructions: data.instructions,
    category: data.category,
    thumbnail: data.thumbnail,
    gameUrl: data.gameUrl,
    createdAt: data.created_at,
    views: Number(data.views) || 0,
  };
}
