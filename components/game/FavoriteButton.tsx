'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { favoritesService } from '@/lib/services/favoritesService';

interface FavoriteButtonProps {
  gameId: string;
}

export default function FavoriteButton({ gameId }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setIsFav(favoritesService.isFavorite(gameId));
  }, [gameId]);

  const handleToggle = () => {
    const nowFav = favoritesService.toggleFavorite(gameId);
    setIsFav(nowFav);
    if (nowFav) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 600);
    }
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      className={`
        group relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md
        font-medium text-[11px] sm:text-xs transition-all duration-300
        ${isFav
          ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30'
          : 'bg-transparent text-slate-400 hover:text-red-400 hover:bg-white/5 border border-white/5'
        }
      `}
    >
      <Heart
        className={`
          w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300
          ${isFav ? 'fill-red-400 text-red-400' : 'fill-none'}
          ${animate ? 'scale-125' : 'scale-100'}
        `}
      />
      <span className="hidden sm:inline">
        {isFav ? '❤️' : '🤍'}
      </span>
    </button>
  );
}
