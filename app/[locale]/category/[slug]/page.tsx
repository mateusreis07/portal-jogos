import { gameService } from '@/lib/services/gameService';
import { GameCategory } from '@/lib/types/game';
import GameGrid from '@/components/game/GameGrid';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const tCat = await getTranslations({ locale, namespace: 'Categories' });
  const categoryTitle = tCat(slug as any);
  return {
    title: `Jogos de ${categoryTitle} Grátis Online - FoxChaos`,
    description: `Explore e jogue os melhores jogos de ${categoryTitle} em HTML5 grátis no seu navegador. Diversão instantânea sem downloads no FoxChaos.`,
    openGraph: {
      title: `Jogar Jogos de ${categoryTitle} Grátis - FoxChaos`,
      description: `Os melhores jogos de ${categoryTitle} online para jogar agora.`,
      url: `https://foxchaos.com/${locale}/category/${slug}`,
      type: 'website',
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug, locale } = await params;
  const games = await gameService.getGamesByCategory(slug as GameCategory);

  const tCat = await getTranslations({ locale, namespace: 'Categories' });
  const tPage = await getTranslations({ locale, namespace: 'CategoryPage' });

  const categoryTitle = tCat(slug as any);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoxChaos', item: 'https://foxchaos.com' },
      { '@type': 'ListItem', position: 2, name: categoryTitle, item: `https://foxchaos.com/${locale}/category/${slug}` },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Jogos de ${categoryTitle}`,
    numberOfItems: games.length,
    itemListElement: games.map((game, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'VideoGame',
        name: game.title,
        url: `https://foxchaos.com/${locale}/game/${game.slug}`,
        image: game.thumbnail,
      },
    })),
  };

  return (
    <div className="flex flex-col gap-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <AdTopBanner />

      <div className="mb-8 border-b border-slate-800 pb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
          {tPage('title', { category: categoryTitle })}
        </h1>
        <p className="text-slate-400 text-lg">
          {tPage('description', { count: games.length, category: categoryTitle.toLowerCase() })}
        </p>
      </div>

      <GameGrid games={games} />
    </div>
  );
}
