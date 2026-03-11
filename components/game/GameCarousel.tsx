'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Game } from '@/lib/types/game';
import GameCard from './GameCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GameCarouselProps {
  games: Game[];
}

export default function GameCarousel({ games }: GameCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (!games || games.length === 0) return null;

  return (
    <div className="relative group">
      {/* Embla Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4">
          {games.map((game) => (
            // A slide taking up specific percentage of width based on breakpoints
            <div
              key={game.id}
              className="flex-[0_0_80%] sm:flex-[0_0_40%] lg:flex-[0_0_25%] xl:flex-[0_0_20%] min-w-0 pl-4 py-4"
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons (Desktop only) */}
      <button
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg border border-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-700 hover:scale-110 disabled:opacity-0 disabled:cursor-not-allowed z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg border border-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-700 hover:scale-110 disabled:opacity-0 disabled:cursor-not-allowed z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
