import fs from 'fs';
import path from 'path';
import { Game, GameCategory } from '../types/game';

// This is the data access layer abstraction.
// Currently reads from a local JSON file.
// In the future, these async functions can easily swap to `supabase.from('games').select('*')` or a fetch from an external API.

const USE_MOCK_DATA = true;

const getGamesData = async (): Promise<Game[]> => {
  if (USE_MOCK_DATA) {
    const filePath = path.join(process.cwd(), 'data', 'games.json');
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(fileContents) as Game[];
  }
  // Future Supabase/API implementation here
  return [];
};

export const gameService = {
  /**
   * Retrieves all available games.
   */
  async getAllGames(): Promise<Game[]> {
    return await getGamesData();
  },

  /**
   * Retrieves a single game by its slug for the game detail page.
   */
  async getGameBySlug(slug: string): Promise<Game | null> {
    const games = await getGamesData();
    return games.find((g) => g.slug === slug) || null;
  },

  /**
   * Retrieves games filtered by category.
   */
  async getGamesByCategory(category: GameCategory, limit?: number): Promise<Game[]> {
    const games = await getGamesData();
    let filtered = games.filter((g) => g.category === category);

    // Sort by newest for categories typically
    filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  },

  /**
   * Retrieves the most popular games based on views.
   */
  async getPopularGames(limit: number = 8): Promise<Game[]> {
    const games = await getGamesData();
    return games.sort((a, b) => b.views - a.views).slice(0, limit);
  },

  /**
   * Retrieves the newest games based on creation date.
   */
  async getNewGames(limit: number = 8): Promise<Game[]> {
    const games = await getGamesData();
    return games.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
  },

  /**
   * Retrieves related games (same category) excluding the current game.
   */
  async getRelatedGames(category: GameCategory, currentSlug: string, limit: number = 4): Promise<Game[]> {
    const games = await getGamesData();
    const related = games.filter((g) => g.category === category && g.slug !== currentSlug);
    // Shuffle or sort by views
    return related.sort((a, b) => b.views - a.views).slice(0, limit);
  },

  /**
   * Searches games by title or description.
   */
  async searchGames(query: string): Promise<Game[]> {
    const games = await getGamesData();
    const lowerQuery = query.toLowerCase();
    return games.filter(
      (g) =>
        g.title.toLowerCase().includes(lowerQuery) ||
        g.description.toLowerCase().includes(lowerQuery) ||
        g.category.toLowerCase().includes(lowerQuery)
    );
  }
};
