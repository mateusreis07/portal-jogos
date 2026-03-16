import { supabase } from '../supabaseClient';
import { Article } from '../types/article';

export const articleService = {
  /**
   * Retrieves an article by its slug and locale
   */
  async getArticleBySlug(slug: string, locale: string): Promise<Article | null> {
    const langKey = locale === 'pt-BR' ? 'pt-BR' : locale;

    // First try the specific locale
    let { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('locale', langKey)
      .eq('published', true)
      .single();

    // If not found in current locale, fallback to English
    if ((error || !data) && langKey !== 'en') {
      const fallbackResult = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('locale', 'en')
        .eq('published', true)
        .single();

      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    if (error || !data) {
      console.error(`Error fetching article by slug ${slug}:`, error?.message);
      return null;
    }

    return data as Article;
  },

  /**
   * Retrieves the latest published articles for a locale
   */
  async getLatestArticles(locale: string, limit: number = 6): Promise<Article[]> {
    const langKey = locale === 'pt-BR' ? 'pt-BR' : locale;

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('locale', langKey)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching articles:', error);
      return [];
    }

    return data as Article[];
  },

  /**
   * Get all article slugs for the sitemap
   */
  async getAllArticleSlugs(): Promise<{ slug: string; created_at: string; locale: string; image_url?: string; title: string }[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('slug, created_at, locale, image_url, title')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching article slugs for sitemap:', error);
      return [];
    }

    return data || [];
  }
};
