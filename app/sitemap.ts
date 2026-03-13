import { MetadataRoute } from 'next';
import { gameService } from '@/lib/services/gameService';
import { locales } from '@/i18n';

// To scale efficiently, we instruct Next.js to revalidate the sitemap periodically
export const revalidate = 86400; // 24 hours in seconds

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://foxchaos.com';

  // 1. Fetch all games optimized for sitemap
  const games = await gameService.getAllGamesSlugs();

  // Fetch all articles
  const { articleService } = await import('@/lib/services/articleService');
  const articles = await articleService.getAllArticleSlugs();

  // 2. Define static routes
  const staticRoutes = [
    '',
    '/popular',
    '/new',
    '/dashboard',
    '/article',
    '/category/arcade',
    '/category/puzzle',
    '/category/racing',
    '/category/shooting',
    '/category/adventure',
    '/category/sports',
    '/category/strategy',
    '/category/multiplayer'
  ];

  // Helper function to generate combinations with localized alternates
  const getLocalizedUrlConfig = (path: string, lastModified: Date) => {
    // Generate the URL for each locale correctly
    const alternates: Record<string, string> = {};
    locales.forEach((locale) => {
      alternates[locale] = `${baseUrl}/${locale}${path}`;
    });

    // Provide the sitemap entry block
    return {
      url: `${baseUrl}/en${path}`, // default fallback URL
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1.0 : path.includes('/game/') ? 0.8 : 0.9,
      alternates: {
        languages: alternates,
      },
    };
  };

  // Build the array
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 3. Add Static Routes
  const now = new Date();
  for (const route of staticRoutes) {
    sitemapEntries.push(getLocalizedUrlConfig(route, now));
  }

  // 4. Add Game Routes
  for (const game of games) {
    const lastMod = game.created_at ? new Date(game.created_at) : now;
    sitemapEntries.push(getLocalizedUrlConfig(`/game/${game.slug}`, lastMod));
  }

  // 5. Add Article Routes
  for (const article of articles) {
    const lastMod = article.created_at ? new Date(article.created_at) : now;
    sitemapEntries.push(getLocalizedUrlConfig(`/article/${article.slug}`, lastMod));
  }

  return sitemapEntries;
}
