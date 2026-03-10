import { gameService } from '@/lib/services/gameService';
import GameGrid from '@/components/game/GameGrid';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Popular Games - Play The Best HTML5 Games',
  description: 'A curated list of the most popular and highly rated free online games on Arcade Hub.',
};

export default async function PopularGamesPage() {
  const games = await gameService.getPopularGames(40); // Top 40 popular games

  return (
    <div className="flex flex-col gap-8">
      <AdTopBanner />

      <div className="mb-4 border-b border-slate-800 pb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-3">
          <span className="text-primary text-3xl">★</span> Popular Games
        </h1>
        <p className="text-slate-400 text-lg">
          The most played games by our community. Join the fun!
        </p>
      </div>

      <GameGrid games={games} />
    </div>
  );
}
