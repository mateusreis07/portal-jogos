import { gameService } from '@/lib/services/gameService';
import GameCarousel from '@/components/game/GameCarousel';
import GameMixedGrid from '@/components/game/GameMixedGrid';
import MobileGameGrid from '@/components/game/MobileGameGrid';
import CategoryCard from '@/components/category/CategoryCard';
import SeoContent from '@/components/home/SeoContent';
import { Gamepad2, Puzzle, CarFront, Crosshair, Map as MapIcon, Trophy, BrainCircuit, Users } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('Home');
  const cat = await getTranslations('Categories');

  // Fetching distinct lots of games
  const [
    newGames,
    arcadeGames,
    puzzleGames,
    racingGames,
    shootingGames,
    adventureGames,
    sportsGames,
    strategyGames,
    multiplayerGames
  ] = await Promise.all([
    gameService.getNewGames(15),
    gameService.getGamesByCategory('arcade', 24),
    gameService.getGamesByCategory('puzzle', 15),
    gameService.getGamesByCategory('racing', 24),
    gameService.getGamesByCategory('shooting', 15),
    gameService.getGamesByCategory('adventure', 24),
    gameService.getGamesByCategory('sports', 15),
    gameService.getGamesByCategory('strategy', 24),
    gameService.getGamesByCategory('multiplayer', 15),
  ]);

  const categories = [
    { title: cat('arcade'), slug: 'arcade', icon: <Gamepad2 size={32} />, colorClass: 'border-blue-500/30' },
    { title: cat('puzzle'), slug: 'puzzle', icon: <Puzzle size={32} />, colorClass: 'border-pink-500/30' },
    { title: cat('racing'), slug: 'racing', icon: <CarFront size={32} />, colorClass: 'border-teal-500/30' },
    { title: cat('shooting'), slug: 'shooting', icon: <Crosshair size={32} />, colorClass: 'border-red-500/30' },
    { title: cat('adventure'), slug: 'adventure', icon: <MapIcon size={32} />, colorClass: 'border-green-500/30' },
    { title: cat('sports'), slug: 'sports', icon: <Trophy size={32} />, colorClass: 'border-orange-500/30' },
    { title: cat('strategy'), slug: 'strategy', icon: <BrainCircuit size={32} />, colorClass: 'border-yellow-500/30' },
    { title: cat('multiplayer'), slug: 'multiplayer', icon: <Users size={32} />, colorClass: 'border-purple-500/30' },
  ];

  /**
   * Helper: Section Header (smaller title, less spacing)
   */
  const SectionHeader = ({ title, href, color }: { title: string; href: string; color: string }) => (
    <div className="flex items-center justify-between mb-2 md:mb-3 px-1">
      <h2 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
        <span className={`${color} w-1.5 h-5 rounded-full inline-block`}></span>
        {title}
      </h2>
      <Link href={href} className="text-primary hover:text-primary/80 font-medium transition-colors text-xs md:text-sm">
        {t('view_all')}
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col gap-5 sm:gap-6 pt-4">

      {/* New Releases — Carousel */}
      {newGames && newGames.length > 0 && (
        <section>
          <SectionHeader title={t('new_title')} href="/new" color="bg-primary" />
          <div className="hidden md:block">
            <GameCarousel games={newGames} />
          </div>
          <div className="md:hidden">
            <MobileGameGrid games={newGames} variant={1} />
          </div>
        </section>
      )}

      {/* Arcade — Mixed Grid (featured + small) */}
      {arcadeGames && arcadeGames.length > 0 && (
        <section>
          <SectionHeader title={cat('arcade')} href="/category/arcade" color="bg-blue-500" />
          <div className="hidden md:block">
            <GameMixedGrid games={arcadeGames} />
          </div>
          <div className="md:hidden">
            <MobileGameGrid games={arcadeGames} variant={2} />
          </div>
        </section>
      )}

      {/* Puzzle — Carousel */}
      {puzzleGames && puzzleGames.length > 0 && (
        <section>
          <SectionHeader title={cat('puzzle')} href="/category/puzzle" color="bg-pink-500" />
          <div className="hidden md:block">
            <GameCarousel games={puzzleGames} />
          </div>
          <div className="md:hidden">
            <MobileGameGrid games={puzzleGames} variant={3} />
          </div>
        </section>
      )}

      {/* Racing — Mixed Grid */}
      {racingGames && racingGames.length > 0 && (
        <section>
          <SectionHeader title={cat('racing')} href="/category/racing" color="bg-teal-500" />
          <div className="hidden md:block">
            <GameMixedGrid games={racingGames} />
          </div>
          <div className="md:hidden">
            <MobileGameGrid games={racingGames} variant={4} />
          </div>
        </section>
      )}

      {/* Shooting — Carousel */}
      {shootingGames && shootingGames.length > 0 && (
        <section>
          <SectionHeader title={cat('shooting')} href="/category/shooting" color="bg-red-500" />
          <div className="hidden md:block">
            <GameCarousel games={shootingGames} />
          </div>
          <div className="md:hidden">
            <MobileGameGrid games={shootingGames} variant={1} />
          </div>
        </section>
      )}

      {/* Adventure — Mixed Grid */}
      {adventureGames && adventureGames.length > 0 && (
        <section>
          <SectionHeader title={cat('adventure')} href="/category/adventure" color="bg-green-500" />
          <div className="hidden md:block">
            <GameMixedGrid games={adventureGames} />
          </div>
          <div className="md:hidden">
            <MobileGameGrid games={adventureGames} variant={2} />
          </div>
        </section>
      )}

      {/* Sports — Carousel */}
      {sportsGames && sportsGames.length > 0 && (
        <section>
          <SectionHeader title={cat('sports')} href="/category/sports" color="bg-orange-500" />
          <div className="hidden md:block">
            <GameCarousel games={sportsGames} />
          </div>
          <div className="md:hidden">
            <MobileGameGrid games={sportsGames} variant={3} />
          </div>
        </section>
      )}

      {/* Strategy — Mixed Grid */}
      {strategyGames && strategyGames.length > 0 && (
        <section>
          <SectionHeader title={cat('strategy')} href="/category/strategy" color="bg-yellow-500" />
          <div className="hidden md:block">
            <GameMixedGrid games={strategyGames} />
          </div>
          <div className="md:hidden">
            <MobileGameGrid games={strategyGames} variant={4} />
          </div>
        </section>
      )}

      {/* Multiplayer — Carousel */}
      {multiplayerGames && multiplayerGames.length > 0 && (
        <section>
          <SectionHeader title={cat('multiplayer')} href="/category/multiplayer" color="bg-indigo-500" />
          <div className="hidden md:block">
            <GameCarousel games={multiplayerGames} />
          </div>
          <div className="md:hidden">
            <MobileGameGrid games={multiplayerGames} variant={1} />
          </div>
        </section>
      )}

      {/* Category Quick Links */}
      <section>
        <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 mb-4 px-1">
          <span className="bg-slate-500 w-1.5 h-5 rounded-full inline-block"></span>
          {t('categories_title')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
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

      {/* SEO Block Content */}
      <SeoContent />

    </div>
  );
}
