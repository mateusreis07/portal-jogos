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
    title: `Play Free ${categoryTitle} Games Online - Arcade Hub`,
    description: `Browse and play the best free ${categoryTitle} HTML5 games directly in your browser without downloads.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug, locale } = await params;
  const games = await gameService.getGamesByCategory(slug as GameCategory);

  const tCat = await getTranslations({ locale, namespace: 'Categories' });
  const tPage = await getTranslations({ locale, namespace: 'CategoryPage' });

  const categoryTitle = tCat(slug as any);

  return (
    <div className="flex flex-col gap-8">
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
