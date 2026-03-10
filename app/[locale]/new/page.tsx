import { gameService } from '@/lib/services/gameService';
import GameGrid from '@/components/game/GameGrid';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newest Games - Latest HTML5 Games Online',
  description: 'Play the newest free HTML5 browser games added today on Arcade Hub.',
};

export default async function NewGamesPage() {
  const games = await gameService.getNewGames(40); // Top 40 new games

  return (
    <div className="flex flex-col gap-8">
      <AdTopBanner />

      <div className="mb-4 border-b border-slate-800 pb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
          Newest Games
        </h1>
        <p className="text-slate-400 text-lg">
          Fresh off the press! Complete new challenges in our latest additions.
        </p>
      </div>

      <GameGrid games={games} />
    </div>
  );
}
