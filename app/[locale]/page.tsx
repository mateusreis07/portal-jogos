import { gameService } from '@/lib/services/gameService';
import GameGrid from '@/components/game/GameGrid';
import CategoryCard from '@/components/category/CategoryCard';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInContent from '@/components/ads/AdInContent';
import { Gamepad2, Puzzle, CarFront, Crosshair, Map, Trophy, BrainCircuit, Users } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const popularGames = await gameService.getPopularGames(8);
  const newGames = await gameService.getNewGames(12);

  const t = await getTranslations('Home');
  const cat = await getTranslations('Categories');

  const categories = [
    { title: cat('arcade'), slug: 'arcade', icon: <Gamepad2 size={32} />, colorClass: 'border-blue-500/30' },
    { title: cat('puzzle'), slug: 'puzzle', icon: <Puzzle size={32} />, colorClass: 'border-pink-500/30' },
    { title: cat('racing'), slug: 'racing', icon: <CarFront size={32} />, colorClass: 'border-teal-500/30' },
    { title: cat('shooting'), slug: 'shooting', icon: <Crosshair size={32} />, colorClass: 'border-red-500/30' },
    { title: cat('adventure'), slug: 'adventure', icon: <Map size={32} />, colorClass: 'border-green-500/30' },
    { title: cat('sports'), slug: 'sports', icon: <Trophy size={32} />, colorClass: 'border-orange-500/30' },
    { title: cat('strategy'), slug: 'strategy', icon: <BrainCircuit size={32} />, colorClass: 'border-yellow-500/30' },
    { title: cat('multiplayer'), slug: 'multiplayer', icon: <Users size={32} />, colorClass: 'border-purple-500/30' },
  ];

  return (
    <div className="flex flex-col gap-12">
      <AdTopBanner />

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="bg-primary w-2 h-8 rounded-full inline-block"></span>
            {t('popular_title')}
          </h2>
          <Link href="/popular" className="text-primary hover:text-primary/80 font-medium transition-colors">
            {t('view_all')}
          </Link>
        </div>
        <GameGrid games={popularGames} />
      </section>

      <AdInContent />

      <section>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 mb-8">
          <span className="bg-primary w-2 h-8 rounded-full inline-block"></span>
          {t('categories_title')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((c) => (
            <CategoryCard
              key={c.slug}
              title={c.title}
              slug={c.slug}
              icon={c.icon}
              colorClass={c.colorClass}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="bg-primary w-2 h-8 rounded-full inline-block"></span>
            {t('new_title')}
          </h2>
          <Link href="/new" className="text-primary hover:text-primary/80 font-medium transition-colors">
            {t('view_all')}
          </Link>
        </div>
        <GameGrid games={newGames} />
      </section>
    </div>
  );
}
