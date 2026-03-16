import { supabase } from '../supabaseClient';

export type ReactionType = 'fire' | 'mindblown' | 'funny' | 'chill';

export interface GameReactionsData {
  fire: number;
  mindblown: number;
  funny: number;
  chill: number;
}

const STORAGE_FINGERPRINT_KEY = 'vibe_user_fingerprint';

export const vibeService = {
  /**
   * Generates or retrieves a unique anonymous identifier for the user's browser
   */
  getFingerprint(): string {
    if (typeof window === 'undefined') return '';
    let fingerprint = localStorage.getItem(STORAGE_FINGERPRINT_KEY);
    if (!fingerprint) {
      // Fallback for non-secure contexts where crypto.randomUUID might be unavailable
      fingerprint = typeof crypto?.randomUUID === 'function' 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem(STORAGE_FINGERPRINT_KEY, fingerprint);
    }
    return fingerprint;
  },

  /**
   * Fetches the global reaction counts for a specific game
   */
  async getGlobalCounts(gameSlug: string): Promise<GameReactionsData> {
    const { data, error } = await supabase
      .from('game_reactions_counts')
      .select('fire, mindblown, funny, chill')
      .eq('game_slug', gameSlug)
      .single();

    if (error || !data) {
      return { fire: 0, mindblown: 0, funny: 0, chill: 0 };
    }

    return data as GameReactionsData;
  },

  /**
   * Fetches the specific reaction a user has given to a game
   */
  async getUserReaction(gameSlug: string): Promise<ReactionType | null> {
    const fingerprint = this.getFingerprint();
    const { data, error } = await supabase
      .from('game_reactions_logs')
      .select('reaction_type')
      .eq('game_slug', gameSlug)
      .eq('user_fingerprint', fingerprint)
      .single();

    if (error || !data) return null;
    return data.reaction_type as ReactionType;
  },

  async saveReaction(gameSlug: string, type: ReactionType | null): Promise<void> {
    const fingerprint = this.getFingerprint();
    
    if (!fingerprint) {
      console.error('Vibe: Unable to generate user fingerprint.');
      return;
    }

    try {
      if (type === null) {
        // Remove reaction
        const { error } = await supabase
          .from('game_reactions_logs')
          .delete()
          .eq('game_slug', gameSlug)
          .eq('user_fingerprint', fingerprint);
        
        if (error) throw error;
      } else {
        // Insert or Update reaction
        const { error } = await supabase
          .from('game_reactions_logs')
          .upsert({
            game_slug: gameSlug,
            user_fingerprint: fingerprint,
            reaction_type: type,
            created_at: new Date().toISOString()
          }, { onConflict: 'game_slug, user_fingerprint' });
        
        if (error) throw error;
      }
    } catch (err: any) {
      console.error('Critical error in saveReaction:', {
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code
      });
      throw err;
    }
  }
};
