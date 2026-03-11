import GamePlayer from '@/components/game/GamePlayer';
import TrackRecentlyPlayed from '@/components/game/TrackRecentlyPlayed';
import GameContentTabs from '@/components/game/GameContentTabs';
import GameGrid from '@/components/game/GameGrid';
import Link from 'next/link';
import { Game } from '@/lib/types/game';

interface GameViewProps {
  game: Game;
  translations: {
    description: string;
    instructions: string;
    tips_tricks: string;
    tip_1: string;
    tip_2: string;
    tip_3: string;
    tags: string;
    related?: string;
  };
  relatedGames?: Game[];
  isInfiniteFeed?: boolean;
}

/**
 * A reusable component that renders the full game player, details, and SEO elements.
 * Extracted so it can be used for both the initial page load and the infinite scroll feed.
 */
export default function GameView({ game, translations: t, relatedGames = [], isInfiniteFeed = false }: GameViewProps) {
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
          {game.tags && game.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold mr-1">{t.tags}</span>
              {game.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/50"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {game.title}
          </h2>
        </div>
      </div>

      <GamePlayer gameId={game.id} gameUrl={game.gameUrl} title={game.title} />

      {/* SEO-Optimized Content Tabs for large text volumes */}
      <GameContentTabs
        title={game.title}
        translations={t}
        content={{
          description: game.description,
          instructions: game.instructions
        }}
      />

      {/* Advanced Related Games Grid (Tags Based) injected before infinite loop */}
      {relatedGames.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mb-6">
            <span className="bg-primary w-2 h-6 rounded-full inline-block"></span>
            {t.related || 'Related Games'} — <span className="capitalize">{game.category}</span>
          </h2>
          <GameGrid games={relatedGames} />
        </div>
      )}
    </div>
  );
}
