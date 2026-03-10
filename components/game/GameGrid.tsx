import { Game } from '@/lib/types/game';
import GameCard from './GameCard';

interface GameGridProps {
  games: Game[];
}

export default function GameGrid({ games }: GameGridProps) {
  if (!games || games.length === 0) {
    return (
      <div className="w-full py-12 text-center text-slate-500">
        No games found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
