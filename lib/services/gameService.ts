import { Game, GameCategory } from '../types/game';
import { supabase } from '../supabaseClient';

export const gameService = {
  /**
   * Retrieves all available games.
   */
  async getAllGames(): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all games:', error);
      return [];
    }

    return (data || []).map(mapSupabaseRowToGame);
  },

  /**
   * Retrieves only game slugs and timestamps for SEO sitemap generation.
   * This is heavily optimized to use minimal DB resources.
   */
  async getAllGamesSlugs(): Promise<{ slug: string; created_at: string }[]> {
    const { data, error } = await supabase
      .from('games')
      .select('slug, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching game slugs for sitemap:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Retrieves a single game by its slug for the game detail page.
   */
  async getGameBySlug(slug: string): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error(`Error fetching game by slug ${slug}:`, error?.message);
      return null;
    }

    return mapSupabaseRowToGame(data);
  },

  /**
   * Retrieves games filtered by category.
   */
  async getGamesByCategory(category: GameCategory, limit?: number): Promise<Game[]> {
    let query = supabase
      .from('games')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching games by category ${category}:`, error);
      return [];
    }

    return (data || []).map(mapSupabaseRowToGame);
  },

  /**
   * Retrieves games that contain a specific tag.
   */
  async getGamesByTag(tag: string, limit?: number): Promise<Game[]> {
    let query = supabase
      .from('games')
      .select('*')
      .contains('tags', [tag])
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching games by tag ${tag}:`, error);
      return [];
    }

    return (data || []).map(mapSupabaseRowToGame);
  },

  /**
   * Retrieves the most popular games based on views.
   */
  async getPopularGames(limit: number = 8): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('views', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching popular games:', error);
      return [];
    }

    return (data || []).map(mapSupabaseRowToGame);
  },

  /**
   * Retrieves the newest games based on creation date.
   */
  async getNewGames(limit: number = 8): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching new games:', error);
      return [];
    }

    return (data || []).map(mapSupabaseRowToGame);
  },

  /**
   * Retrieves related games (same category) excluding the current game.
   */
  async getRelatedGames(category: GameCategory, currentSlug: string, limit: number = 4): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('category', category)
      .neq('slug', currentSlug)
      .order('views', { ascending: false }) // sort by views mostly
      .limit(limit);

    if (error) {
      console.error(`Error fetching related games:`, error);
      return [];
    }

    return (data || []).map(mapSupabaseRowToGame);
  },

  /**
   * Retrieves advanced related games.
   * Prioritizes games with the exact same tags, falls back to same category.
   */
  async getAdvancedRelatedGames(game: Game, limit: number = 6): Promise<Game[]> {
    let relatedGames: any[] = [];

    // 1. If game has tags, try to find games with matching tags first
    if (game.tags && game.tags.length > 0) {
      // Supabase contains operator works with arrays. We use overlap (&&) to find *any* matching tag
      // However, Supabase JS client 'contains' means elements must be fully included.
      // Often overlap '&&' is not directly exposed as a simple filter depending on setup.
      // Using 'contains' loops OR fallback might be safer.

      // Let's perform a simple 'contains' OR query for the first 3 tags for performance
      const topTags = game.tags.slice(0, 3);

      const orQuery = topTags.map(t => `tags.cs.{${t}}`).join(',');

      if (orQuery) {
        const { data: tagData, error: tagError } = await supabase
          .from('games')
          .select('*')
          .or(orQuery)
          .neq('id', game.id)
          .order('views', { ascending: false })
          .limit(limit);

        if (!tagError && tagData) {
          relatedGames = [...tagData];
        }
      }
    }

    // 2. If we still don't have enough games, fill the rest with same category top games
    if (relatedGames.length < limit) {
      const remainingLimit = limit - relatedGames.length;
      const excludeIds = [game.id, ...relatedGames.map(g => g.id)];

      const { data: catData, error: catError } = await supabase
        .from('games')
        .select('*')
        .eq('category', game.category)
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .order('views', { ascending: false })
        .limit(remainingLimit);

      if (!catError && catData) {
        relatedGames = [...relatedGames, ...catData];
      }
    }

    return relatedGames.map(mapSupabaseRowToGame);
  },

  /**
   * Searches games by title or description.
   */
  async searchGames(query: string): Promise<Game[]> {
    const lowerQuery = query.toLowerCase();

    // Supabase has nice full-text search, or we can use ilike for simple text search (title or description)
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .or(`title.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%,category.ilike.%${lowerQuery}%`)
      .order('views', { ascending: false });

    if (error) {
      console.error(`Error searching games for [${query}]:`, error);
      return [];
    }

    return (data || []).map(mapSupabaseRowToGame);
  }
};

// Map DB snake_case columns back to CamelCase for the Game interface
// To avoid breaking frontend components expecting Game object format
function mapSupabaseRowToGame(row: any): Game {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    instructions: row.instructions,
    category: row.category,
    thumbnail: row.thumbnail,
    gameUrl: row.gameUrl,
    tags: Array.isArray(row.tags) ? row.tags : (row.tags ? [row.tags] : []), // Fallback just in case, ensuring it's an array
    createdAt: row.created_at,
    views: Number(row.views) || 0,
  };
}
