import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/lib/types/game';

interface MobileGameGridProps {
  games: Game[];
  variant: 1 | 2 | 3 | 4;
}

function MobileGameItem({ game, className, isSpecialLarge }: { game: Game; className: string; isSpecialLarge?: boolean }) {
  if (!game) return null;
  return (
    <Link href={`/game/${game.slug}`} className={`group block ${className}`}>
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-900 shadow-sm active:scale-95 transition-transform">
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          className="object-cover"
          sizes={isSpecialLarge ? "(max-width: 768px) 66vw, 33vw" : "(max-width: 768px) 33vw, 20vw"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent opacity-60" />
        <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2">
          <h3 className="font-bold text-white leading-tight truncate text-[10px] sm:text-xs text-shadow-sm">
             {game.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export default function MobileGameGrid({ games, variant }: MobileGameGridProps) {
  const displayGames = games.slice(0, 3);
  if (displayGames.length === 0) return null;

  if (variant === 1 || variant === 3) {
    return (
      <div className="grid grid-cols-3 gap-2 px-1">
        {displayGames.map((game, i) => (
          <MobileGameItem key={game.id || i} game={game} className="col-span-1 row-span-1 aspect-square" />
        ))}
      </div>
    );
  }

  if (variant === 2) {
    return (
      <div className="grid grid-cols-3 gap-2 px-1">
        {displayGames[0] && (
          <MobileGameItem game={displayGames[0]} className="col-span-2 row-span-2" isSpecialLarge />
        )}
        {displayGames[1] && (
          <MobileGameItem game={displayGames[1]} className="col-span-1 row-span-1 aspect-square" />
        )}
        {displayGames[2] && (
          <MobileGameItem game={displayGames[2]} className="col-span-1 row-span-1 aspect-square" />
        )}
      </div>
    );
  }

  if (variant === 4) {
    return (
      <div className="grid grid-cols-3 gap-2 px-1">
        {displayGames[0] && (
           <MobileGameItem game={displayGames[0]} className="col-span-1 row-span-1 aspect-square" />
        )}
        {displayGames[1] && (
           <MobileGameItem game={displayGames[1]} className="col-span-2 row-span-2" isSpecialLarge />
        )}
        {displayGames[2] && (
           <MobileGameItem game={displayGames[2]} className="col-span-1 row-span-1 aspect-square" />
        )}
      </div>
    );
  }

  return null;
}
