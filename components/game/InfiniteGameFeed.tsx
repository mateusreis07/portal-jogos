'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Game } from '@/lib/types/game';
import { loadNextGame } from '@/lib/actions/gameActions';
import GameView from '@/components/game/GameView';
import AdTopBanner from '@/components/ads/AdTopBanner';

interface InfiniteGameFeedProps {
  initialCategory: string;
  initialExcludeIds: string[];
  initialTags?: string[];
  locale: string;
  translations: {
    description: string;
    instructions: string;
    tips_tricks: string;
    tip_1: string;
    tip_2: string;
    tip_3: string;
    tags: string;
    related: string;
  };
  quickVibeLabels: {
    title: string;
    fire: string;
    mindblown: string;
    funny: string;
    chill: string;
    votes: string;
  };
}

export default function InfiniteGameFeed({
  initialCategory,
  initialExcludeIds,
  initialTags,
  locale,
  translations,
  quickVibeLabels,
}: InfiniteGameFeedProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [excludeIds, setExcludeIds] = useState<string[]>(initialExcludeIds);
  const [currentTags, setCurrentTags] = useState<string[] | undefined>(initialTags);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchNextGame = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextGame = await loadNextGame(initialCategory, excludeIds, locale, currentTags);

      if (nextGame) {
        setGames((prev) => [...prev, nextGame]);
        setExcludeIds((prev) => [...prev, nextGame.id]);
        if (nextGame.tags && nextGame.tags.length > 0) {
          setCurrentTags(nextGame.tags);
        }
      } else {
        // No more games found in this category
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load next game:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [initialCategory, excludeIds, currentTags, locale, loading, hasMore]);

  // Intersection Observer to trigger load when scrolling near the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextGame();
        }
      },
      { threshold: 0.1, rootMargin: '400px' } // Pre-load 400px before the user sees the spinner
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextGame]);

  return (
    <div className="flex flex-col gap-12 mt-12 pt-12">
      {games.map((game, index) => (
        <div key={game.id} className="flex flex-col gap-8">
          {/* Inject an Ad Banner between every new loaded game to maximize revenue */}
          <div className="border-y border-slate-800/50 py-8 bg-slate-900/30">
            <AdTopBanner />
          </div>

          <div className="pt-8">
            <GameView game={game} translations={translations} quickVibeLabels={quickVibeLabels} isInfiniteFeed={true} />
          </div>
        </div>
      ))}

      {/* Loading trigger and spinner */}
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center items-center py-16">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-slate-700 border-t-primary rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium animate-pulse">Loading next game...</p>
            </div>
          ) : (
            <div className="h-10"></div> /* Invisible spacer for the observer */
          )}
        </div>
      )}

      {!hasMore && games.length > 0 && (
        <div className="text-center py-8 text-slate-500 font-medium">
          You've reached the end of this category! Try another one above.
        </div>
      )}
    </div>
  );
}
