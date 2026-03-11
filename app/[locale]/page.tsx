import { gameService } from '@/lib/services/gameService';
import GameCarousel from '@/components/game/GameCarousel';
import CategoryCard from '@/components/category/CategoryCard';
import AdInContent from '@/components/ads/AdInContent';
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
    gameService.getNewGames(15),                        // Destinated for New Shelf
    gameService.getGamesByCategory('arcade', 15),       // Arcade Shelf
    gameService.getGamesByCategory('puzzle', 15),       // Puzzle Shelf
    gameService.getGamesByCategory('racing', 15),
    gameService.getGamesByCategory('shooting', 15),
    gameService.getGamesByCategory('adventure', 15),
    gameService.getGamesByCategory('sports', 15),
    gameService.getGamesByCategory('strategy', 15),
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

  return (
    <div className="flex flex-col gap-8 sm:gap-10 pt-8">

      {/* 3. New Releases Shelf */}
      {newGames && newGames.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="bg-primary w-2 h-6 md:h-8 rounded-full inline-block"></span>
              {t('new_title')}
            </h2>
            <Link href="/new" className="text-primary hover:text-primary/80 font-medium transition-colors text-sm md:text-base">
              {t('view_all')}
            </Link>
          </div>
          <GameCarousel games={newGames} />
        </section>
      )}

      <AdInContent />

      {/* 4. Arcade Shelf */}
      {arcadeGames && arcadeGames.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="bg-blue-500 w-2 h-6 md:h-8 rounded-full inline-block"></span>
              {cat('arcade')}
            </h2>
            <Link href="/category/arcade" className="text-primary hover:text-primary/80 font-medium transition-colors text-sm md:text-base">
              {t('view_all')}
            </Link>
          </div>
          <GameCarousel games={arcadeGames} />
        </section>
      )}

      {/* 5. Puzzle Shelf */}
      {puzzleGames && puzzleGames.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="bg-pink-500 w-2 h-6 md:h-8 rounded-full inline-block"></span>
              {cat('puzzle')}
            </h2>
            <Link href="/category/puzzle" className="text-primary hover:text-primary/80 font-medium transition-colors text-sm md:text-base">
              {t('view_all')}
            </Link>
          </div>
          <GameCarousel games={puzzleGames} />
        </section>
      )}

      {/* 6. Racing Shelf */}
      {racingGames && racingGames.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="bg-teal-500 w-2 h-6 md:h-8 rounded-full inline-block"></span>
              {cat('racing')}
            </h2>
            <Link href="/category/racing" className="text-primary hover:text-primary/80 font-medium transition-colors text-sm md:text-base">
              {t('view_all')}
            </Link>
          </div>
          <GameCarousel games={racingGames} />
        </section>
      )}

      {/* 7. Shooting Shelf */}
      {shootingGames && shootingGames.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="bg-red-500 w-2 h-6 md:h-8 rounded-full inline-block"></span>
              {cat('shooting')}
            </h2>
            <Link href="/category/shooting" className="text-primary hover:text-primary/80 font-medium transition-colors text-sm md:text-base">
              {t('view_all')}
            </Link>
          </div>
          <GameCarousel games={shootingGames} />
        </section>
      )}

      {/* 8. Adventure Shelf */}
      {adventureGames && adventureGames.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="bg-green-500 w-2 h-6 md:h-8 rounded-full inline-block"></span>
              {cat('adventure')}
            </h2>
            <Link href="/category/adventure" className="text-primary hover:text-primary/80 font-medium transition-colors text-sm md:text-base">
              {t('view_all')}
            </Link>
          </div>
          <GameCarousel games={adventureGames} />
        </section>
      )}

      {/* 9. Sports Shelf */}
      {sportsGames && sportsGames.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="bg-orange-500 w-2 h-6 md:h-8 rounded-full inline-block"></span>
              {cat('sports')}
            </h2>
            <Link href="/category/sports" className="text-primary hover:text-primary/80 font-medium transition-colors text-sm md:text-base">
              {t('view_all')}
            </Link>
          </div>
          <GameCarousel games={sportsGames} />
        </section>
      )}

      {/* 10. Strategy Shelf */}
      {strategyGames && strategyGames.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="bg-yellow-500 w-2 h-6 md:h-8 rounded-full inline-block"></span>
              {cat('strategy')}
            </h2>
            <Link href="/category/strategy" className="text-primary hover:text-primary/80 font-medium transition-colors text-sm md:text-base">
              {t('view_all')}
            </Link>
          </div>
          <GameCarousel games={strategyGames} />
        </section>
      )}

      {/* 11. Multiplayer Shelf */}
      {multiplayerGames && multiplayerGames.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="bg-purple-500 w-2 h-6 md:h-8 rounded-full inline-block"></span>
              {cat('multiplayer')}
            </h2>
            <Link href="/category/multiplayer" className="text-primary hover:text-primary/80 font-medium transition-colors text-sm md:text-base">
              {t('view_all')}
            </Link>
          </div>
          <GameCarousel games={multiplayerGames} />
        </section>
      )}

      {/* 12. Category Quick Links */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mb-6 px-1">
          <span className="bg-slate-500 w-2 h-6 rounded-full inline-block"></span>
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

    </div>
  );
}
