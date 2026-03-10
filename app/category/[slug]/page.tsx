import { gameService } from '@/lib/services/gameService';
import { GameCategory } from '@/lib/types/game';
import GameGrid from '@/components/game/GameGrid';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { Metadata } from 'next';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryTitle = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  return {
    title: `Play Free ${categoryTitle} Games Online - Arcade Hub`,
    description: `Browse and play the best free ${categoryTitle} HTML5 games directly in your browser without downloads.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryTitle = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  const games = await gameService.getGamesByCategory(params.slug as GameCategory);

  return (
    <div className="flex flex-col gap-8">
      <AdTopBanner />

      <div className="mb-8 border-b border-slate-800 pb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
          {categoryTitle} Games
        </h1>
        <p className="text-slate-400 text-lg">
          Explore {games.length} amazing {categoryTitle.toLowerCase()} games. Play instantly for free.
        </p>
      </div>

      <GameGrid games={games} />
    </div>
  );
}
