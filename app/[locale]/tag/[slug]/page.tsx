import { gameService } from '@/lib/services/gameService';
import GameGrid from '@/components/game/GameGrid';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface TagPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  // Tag format usually is something like 'car-games' or 'io', so we format it a bit better.
  const tagTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `Play Free ${tagTitle} Games Online - FoxChaos`,
    description: `Browse and play the best free ${tagTitle} HTML5 games directly in your browser without downloads.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug, locale } = await params;
  const games = await gameService.getGamesByTag(slug);

  const tPage = await getTranslations({ locale, namespace: 'TagPage' });
  const tagTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="flex flex-col gap-8">
      <AdTopBanner />

      <div className="mb-8 border-b border-slate-800 pb-8 mt-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
          {tPage('title', { tag: tagTitle })}
        </h1>
        <p className="text-slate-400 text-lg">
          {tPage('description', { count: games.length, tag: tagTitle.toLowerCase() })}
        </p>
      </div>

      {games.length > 0 ? (
        <GameGrid games={games} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-800/20 rounded-2xl border border-slate-800/50">
          <p className="text-slate-400 text-lg">No games found for this tag yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
