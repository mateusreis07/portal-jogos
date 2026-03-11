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
        group relative inline-flex items-center gap-2 px-4 py-2 rounded-lg
        font-medium text-sm transition-all duration-300
        ${isFav
          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
          : 'bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 border border-slate-700'
        }
      `}
    >
      <Heart
        className={`
          w-5 h-5 transition-all duration-300
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
