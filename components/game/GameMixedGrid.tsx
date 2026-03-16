'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/lib/types/game';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GameMixedGridProps {
  games: Game[];
}

const GRID_POSITIONS: Record<number, string> = {
  0: 'md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-3',
  1: 'md:col-start-3 md:col-end-4 md:row-start-1 md:row-end-2',
  2: 'md:col-start-4 md:col-end-5 md:row-start-1 md:row-end-2',
  3: 'md:col-start-5 md:col-end-7 md:row-start-1 md:row-end-3',
  4: 'md:col-start-3 md:col-end-4 md:row-start-2 md:row-end-3',
  5: 'md:col-start-4 md:col-end-5 md:row-start-2 md:row-end-3',
  6: 'md:col-start-1 md:col-end-2 md:row-start-3 md:row-end-4',
  7: 'md:col-start-2 md:col-end-3 md:row-start-3 md:row-end-4',
  8: 'md:col-start-3 md:col-end-4 md:row-start-3 md:row-end-4',
  9: 'md:col-start-4 md:col-end-5 md:row-start-3 md:row-end-4',
  10: 'md:col-start-5 md:col-end-6 md:row-start-3 md:row-end-4',
  11: 'md:col-start-6 md:col-end-7 md:row-start-3 md:row-end-4',
};

const FEATURED_INDICES = new Set([0, 3]);

function GameItem({ game, index }: { game: Game; index: number }) {
  const isFeatured = FEATURED_INDICES.has(index);
  const position = GRID_POSITIONS[index] || '';

  return (
    <Link
      href={`/game/${game.slug}`}
      className={`group block ${position}`}
    >
      <div className="relative w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800/50 transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-[0_0_20px_rgba(255,90,0,0.25)] aspect-[4/3] md:aspect-auto md:h-full"
        style={{ minHeight: isFeatured ? undefined : undefined }}>
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={isFeatured ? '(max-width: 768px) 50vw, 33vw' : '(max-width: 768px) 50vw, 16vw'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        <div className={`absolute bottom-0 left-0 right-0 p-2 ${isFeatured ? 'md:p-3 lg:p-4' : ''}`}>
          <h3 className={`font-bold text-white leading-tight truncate text-xs ${isFeatured ? 'md:text-base lg:text-lg' : 'md:text-sm'}`}>
            {game.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

function GridPage({ games }: { games: Game[] }) {
  return (
    <>
      {/* Mobile: simple uniform 2-col grid */}
      <div className="grid grid-cols-2 gap-2 md:hidden">
        {games.map((game, index) => (
          <Link key={game.id} href={`/game/${game.slug}`} className="group block">
            <div className="relative w-full rounded-xl overflow-hidden bg-slate-800 border border-slate-700/50 transition-all duration-300 group-hover:border-primary/60 aspect-[4/3]">
              <Image
                src={game.thumbnail}
                alt={game.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <h3 className="font-bold text-white leading-tight truncate text-xs">
                  {game.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: mixed-size grid with explicit placement */}
      <div
        className="hidden md:grid md:grid-cols-6 gap-3"
        style={{ gridTemplateRows: 'repeat(3, minmax(120px, 1fr))' }}
      >
        {games.map((game, index) => (
          <GameItem key={game.id} game={game} index={index} />
        ))}
      </div>
    </>
  );
}

export default function GameMixedGrid({ games }: GameMixedGridProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    watchDrag: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (!games || games.length === 0) return null;

  // Split games into pages of 12
  const pages: Game[][] = [];
  for (let i = 0; i < games.length; i += 12) {
    const page = games.slice(i, i + 12);
    if (page.length > 0) pages.push(page);
  }

  if (pages.length === 1) {
    return <GridPage games={pages[0]} />;
  }

  return (
    <div className="relative group/carousel">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {pages.map((pageGames, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 pr-4">
              <GridPage games={pageGames} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows (desktop only) */}
      <button
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg border border-slate-700 opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-slate-700 hover:scale-110 disabled:opacity-0 disabled:cursor-not-allowed z-10"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg border border-slate-700 opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-slate-700 hover:scale-110 disabled:opacity-0 disabled:cursor-not-allowed z-10"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Page Dots */}
      <div className="flex justify-center gap-2 mt-3">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi && emblaApi.scrollTo(i)}
            className={`w-2 h-2 rounded-full transition-all ${selectedIndex === i
                ? 'bg-primary w-6'
                : 'bg-slate-600 hover:bg-slate-500'
              }`}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
