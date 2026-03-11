'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/lib/types/game';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface HeroCarouselProps {
  games: Game[];
}

export default function HeroCarousel({ games }: HeroCarouselProps) {
  const t = useTranslations('Game');
  // Initialize Embla with Autoplay plugin
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
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
    <div className="relative group rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {games.map((game) => (
            <div className="flex-[0_0_100%] min-w-0 relative aspect-[2/1] sm:aspect-[21/9] lg:aspect-[3/1]" key={game.id}>
              {/* Blurred Background */}
              <div className="absolute inset-0">
                <Image
                  src={game.thumbnail}
                  alt="Background"
                  fill
                  className="object-cover blur-xl opacity-40 scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center p-6 md:p-12 z-10">
                <div className="flex max-w-7xl mx-auto w-full gap-8 items-center">

                  {/* Left Side: Info */}
                  <div className="flex-1 max-w-xl space-y-4 md:space-y-6">
                    <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs md:text-sm font-bold uppercase tracking-widest rounded-full backdrop-blur-md">
                      {t('featured')}
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg line-clamp-2">
                      {game.title}
                    </h1>
                    <p className="text-slate-300 text-sm md:text-lg line-clamp-2 md:line-clamp-3 drop-shadow-md">
                      {game.description || t('play_action')}
                    </p>
                    <div className="pt-2">
                      <Link
                        href={`/game/${game.slug}`}
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                      >
                        <Play className="w-5 h-5 fill-white" />
                        {t('play_now')}
                      </Link>
                    </div>
                  </div>

                  {/* Right Side: Visual Thumbnail (hidden on very small screens) */}
                  <div className="hidden md:block flex-shrink-0 relative w-64 h-64 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800/50 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <Image
                      src={game.thumbnail}
                      alt={game.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 256px, 320px"
                    />
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-slate-900/50 hover:bg-primary text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-4 group-hover:translate-x-0 disabled:hidden"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-slate-900/50 hover:bg-primary text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 disabled:hidden"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex ? 'w-8 bg-primary' : 'bg-white/30 hover:bg-white/50'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
