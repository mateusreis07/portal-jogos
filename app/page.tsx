import { gameService } from '@/lib/services/gameService';
import GameGrid from '@/components/game/GameGrid';
import CategoryCard from '@/components/category/CategoryCard';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInContent from '@/components/ads/AdInContent';
import { Gamepad2, Puzzle, CarFront, Crosshair, Map, Trophy, BrainCircuit, Users } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const popularGames = await gameService.getPopularGames(8);
  const newGames = await gameService.getNewGames(12);

  const categories = [
    { title: 'Arcade', slug: 'arcade', icon: <Gamepad2 size={32} />, colorClass: 'border-blue-500/30' },
    { title: 'Puzzle', slug: 'puzzle', icon: <Puzzle size={32} />, colorClass: 'border-pink-500/30' },
    { title: 'Racing', slug: 'racing', icon: <CarFront size={32} />, colorClass: 'border-teal-500/30' },
    { title: 'Shooting', slug: 'shooting', icon: <Crosshair size={32} />, colorClass: 'border-red-500/30' },
    { title: 'Adventure', slug: 'adventure', icon: <Map size={32} />, colorClass: 'border-green-500/30' },
    { title: 'Sports', slug: 'sports', icon: <Trophy size={32} />, colorClass: 'border-orange-500/30' },
    { title: 'Strategy', slug: 'strategy', icon: <BrainCircuit size={32} />, colorClass: 'border-yellow-500/30' },
    { title: 'Multiplayer', slug: 'multiplayer', icon: <Users size={32} />, colorClass: 'border-purple-500/30' },
  ];

  return (
    <div className="flex flex-col gap-12">
      <AdTopBanner />

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="bg-primary w-2 h-8 rounded-full inline-block"></span>
            Popular Right Now
          </h2>
          <Link href="/popular" className="text-primary hover:text-primary/80 font-medium transition-colors">
            View all →
          </Link>
        </div>
        <GameGrid games={popularGames} />
      </section>

      <AdInContent />

      <section>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 mb-8">
          <span className="bg-primary w-2 h-8 rounded-full inline-block"></span>
          Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.slug}
              title={cat.title}
              slug={cat.slug}
              icon={cat.icon}
              colorClass={cat.colorClass}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="bg-primary w-2 h-8 rounded-full inline-block"></span>
            New Additions
          </h2>
          <Link href="/new" className="text-primary hover:text-primary/80 font-medium transition-colors">
            View all →
          </Link>
        </div>
        <GameGrid games={newGames} />
      </section>
    </div>
  );
}
