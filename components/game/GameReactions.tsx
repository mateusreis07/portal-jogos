'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { vibeService, ReactionType, GameReactionsData } from '@/lib/services/vibeService';

interface GameReactionsProps {
  gameSlug: string;
  labels: {
    title: string;
    fire: string;
    mindblown: string;
    funny: string;
    chill: string;
    votes: string;
  };
}

const REACTION_EMOJIS: Record<ReactionType, string> = {
  fire: '🔥',
  mindblown: '🤯',
  funny: '😂',
  chill: '💤'
};

export default function GameReactions({ gameSlug, labels }: GameReactionsProps) {
  const [counts, setCounts] = useState<GameReactionsData>({
    fire: 0,
    mindblown: 0,
    funny: 0,
    chill: 0
  });
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    async function initReactions() {
      setIsLoaded(false);
      try {
        // Fetch global counts and user's specific reaction from Supabase
        const [globalData, userVibe] = await Promise.all([
          vibeService.getGlobalCounts(gameSlug),
          vibeService.getUserReaction(gameSlug)
        ]);

        setCounts(globalData);
        setUserReaction(userVibe);
      } catch (error) {
        console.error('Failed to load reactions:', error);
      } finally {
        setIsLoaded(true);
      }
    }

    initReactions();
  }, [gameSlug]);

  const handleReaction = async (type: ReactionType) => {
    if (!isLoaded || isPending) return;

    const isRemoving = userReaction === type;
    const nextReaction = isRemoving ? null : type;
    
    // 1. Optimistic UI update
    const previousCounts = { ...counts };
    const previousUserReaction = userReaction;

    setCounts((prev: GameReactionsData) => {
      const newCounts = { ...prev };
      if (previousUserReaction) newCounts[previousUserReaction] = Math.max(0, newCounts[previousUserReaction] - 1);
      if (nextReaction) newCounts[nextReaction]++;
      return newCounts;
    });
    setUserReaction(nextReaction);
    setIsPending(true);

    try {
      // 2. Persist to Supabase
      await vibeService.saveReaction(gameSlug, nextReaction);
      
      // 3. Optional: Brief delay then re-fetch global counts to stay in sync with others & trigger
      setTimeout(async () => {
        const globalData = await vibeService.getGlobalCounts(gameSlug);
        setCounts(globalData);
      }, 800);
      
    } catch (error) {
      // Rollback on error
      console.error('Failed to save reaction:', error);
      setCounts(previousCounts);
      setUserReaction(previousUserReaction);
    } finally {
      setIsPending(false);
    }
  };

  if (!isLoaded) {
    return <div className="h-16 animate-pulse bg-slate-800/30 rounded-xl" />;
  }

  return (
    <div className="w-full flex items-center justify-between py-1.5 px-3 bg-[#08081a]/40 rounded-lg border border-white/5 overflow-x-auto no-scrollbar">
      <h3 className="text-slate-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap mr-3 hidden sm:block">
        {labels.title}
      </h3>
      <div className="flex flex-row items-center gap-1 md:gap-2 w-full sm:w-auto justify-around sm:justify-end">
        {(Object.keys(REACTION_EMOJIS) as ReactionType[]).map((type) => {
          const isSelected = userReaction === type;
          
          return (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleReaction(type)}
              className={`flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md border transition-all duration-300 shrink-0 ${
                isSelected 
                  ? 'bg-primary/10 border-primary/30 text-primary' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 opacity-80 hover:opacity-100'
              }`}
            >
              <span className="text-sm sm:text-base leading-none">{REACTION_EMOJIS[type]}</span>
              <div className="flex flex-col items-start leading-[1.1]">
                <span className={`text-[9px] sm:text-[10px] font-bold ${isSelected ? 'text-primary' : 'text-slate-300'}`}>
                  {labels[type as keyof typeof labels] || type}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={counts[type]}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`text-[8px] sm:text-[9px] ${isSelected ? 'text-primary/80' : 'text-slate-500'}`}
                  >
                    {counts[type]} {labels.votes}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
