import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/lib/types/game';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/game/${game.slug}`} className="group block">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(255,90,0,0.35)]">
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-bold text-white text-sm md:text-base leading-tight truncate">{game.title}</h3>
        </div>
      </div>
    </Link>
  );
}
