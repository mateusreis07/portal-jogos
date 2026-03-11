import GamePlayer from '@/components/game/GamePlayer';
import FavoriteButton from '@/components/game/FavoriteButton';
import TrackRecentlyPlayed from '@/components/game/TrackRecentlyPlayed';
import Link from 'next/link';
import { Game } from '@/lib/types/game';

interface GameViewProps {
  game: Game;
  translations: {
    description: string;
    instructions: string;
  };
}

/**
 * A reusable component that renders the full game player, details, and SEO elements.
 * Extracted so it can be used for both the initial page load and the infinite scroll feed.
 */
export default function GameView({ game, translations: t }: GameViewProps) {
  return (
    <div className="flex flex-col gap-8 pb-12 mb-12 border-b border-slate-800">
      {/* Track this game as recently played */}
      <TrackRecentlyPlayed gameId={game.id} />

      {/* Game Header with Favorite Button */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Link
            href={`/category/${game.category}`}
            className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded-md hover:bg-primary/30 transition-colors"
          >
            {game.category}
          </Link>
        </div>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {game.title}
          </h2>
          <FavoriteButton gameId={game.id} />
        </div>
      </div>

      <GamePlayer gameUrl={game.gameUrl} title={game.title} />

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 md:p-8">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4">{t.description} — {game.title}</h2>
          <p className="text-slate-300 mb-8 leading-relaxed text-lg">
            {game.description}
          </p>

          <h3 className="text-xl font-bold mb-3 text-primary">{t.instructions}</h3>
          <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 mb-8">
            {game.instructions}
          </p>

          <h3 className="text-xl font-bold mb-3 text-primary">Tips & Tricks</h3>
          <ul className="text-slate-300 leading-relaxed list-disc pl-5 space-y-2">
            <li>Practice the controls before jumping into the action.</li>
            <li>Take regular breaks to rest your eyes.</li>
            <li>Challenge your friends to beat your high score!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
