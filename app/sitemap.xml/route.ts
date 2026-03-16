import { gameService } from '@/lib/services/gameService';
import { articleService } from '@/lib/services/articleService';
import { locales } from '@/i18n';

export const revalidate = 86400; // 24 hours

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://foxchaos.com';
  const now = new Date().toISOString();

  // 1. Fetch Data
  const [games, articles, tags] = await Promise.all([
    gameService.getAllGamesSlugs(),
    articleService.getAllArticleSlugs(),
    gameService.getAllTags(),
  ]);

  // 2. Define Static Routes
  const staticRoutes = [
    '',
    '/popular',
    '/new',
    '/dashboard',
    '/article',
    '/tags',
    '/category/arcade',
    '/category/puzzle',
    '/category/racing',
    '/category/shooting',
    '/category/adventure',
    '/category/sports',
    '/category/strategy',
    '/category/multiplayer'
  ];

  // 3. Build XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  // Helper for static & dynamic items
  const addUrl = (path: string, lastMod: string, priority: string, image?: { loc: string, title: string }) => {
    xml += `
  <url>
    <loc>${baseUrl}/pt-BR${path}</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>${priority}</priority>
    <changefreq>weekly</changefreq>`;

    // Alternates
    locales.forEach(loc => {
      xml += `
    <xhtml:link rel="alternate" hreflang="${loc}" href="${baseUrl}/${loc}${path}" />`;
    });
    xml += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${path}" />`;

    // Image
    if (image) {
      xml += `
    <image:image>
      <image:loc>${image.loc}</image:loc>
      <image:title>${image.title}</image:title>
    </image:image>`;
    }

    xml += `
  </url>`;
  };

  // Static
  staticRoutes.forEach(route => {
    addUrl(route, now, route === '' ? '1.0' : '0.8');
  });

  // Games
  games.forEach(game => {
    addUrl(`/game/${game.slug}`, game.created_at || now, '0.8', {
      loc: game.thumbnail,
      title: game.title
    });
  });

  // Articles
  articles.forEach(article => {
    addUrl(`/article/${article.slug}`, article.created_at || now, '0.7', {
      loc: article.image_url || '',
      title: article.title
    });
  });

  // Tags
  tags.forEach(tag => {
    addUrl(`/tag/${tag}`, now, '0.6');
  });

  xml += `
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
