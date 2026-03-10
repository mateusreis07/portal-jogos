import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/lib/types/game';
import { Play } from 'lucide-react';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/game/${game.slug}`} className="group block">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 border border-slate-700 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100">
          <div className="bg-primary/90 p-4 rounded-full backdrop-blur-sm shadow-lg">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="inline-block px-2 py-1 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider rounded backdrop-blur-md mb-2">
            {game.category}
          </div>
          <h3 className="font-bold text-white text-lg leading-tight truncate">{game.title}</h3>
        </div>
      </div>
    </Link>
  );
}
