'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { favoritesService, RecentEntry } from '@/lib/services/favoritesService';
import { supabase } from '@/lib/supabaseClient';
import { Heart, Clock, Gamepad2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface GamePreview {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  category: string;
}

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const [favorites, setFavorites] = useState<GamePreview[]>([]);
  const [recents, setRecents] = useState<GamePreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const favIds = favoritesService.getFavorites();
      const recentEntries: RecentEntry[] = favoritesService.getRecentlyPlayed();
      const recentIds = recentEntries.map((r) => r.gameId);
      const allIds = Array.from(new Set([...favIds, ...recentIds]));

      if (allIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('games')
        .select('id, slug, title, thumbnail, category')
        .in('id', allIds);

      if (data) {
        const map = new Map(data.map((g) => [g.id, g as GamePreview]));
        setFavorites(favIds.map((id) => map.get(id)).filter(Boolean) as GamePreview[]);
        setRecents(recentIds.map((id) => map.get(id)).filter(Boolean) as GamePreview[]);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-primary" />
          {t('title')}
        </h1>
        <p className="text-slate-400 mt-2">{t('subtitle')}</p>
      </div>

      {/* Favorites Section */}
      <section>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
          <Heart className="w-6 h-6 text-red-400 fill-red-400" />
          {t('favorites')}
        </h2>

        {loading ? (
          <SkeletonGrid />
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-12 h-12 text-slate-600" />}
            title={t('empty_favorites_title')}
            description={t('empty_favorites_desc')}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {favorites.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>

      {/* Recently Played Section */}
      <section>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
          <Clock className="w-6 h-6 text-blue-400" />
          {t('recent')}
        </h2>

        {loading ? (
          <SkeletonGrid />
        ) : recents.length === 0 ? (
          <EmptyState
            icon={<Clock className="w-12 h-12 text-slate-600" />}
            title={t('empty_recent_title')}
            description={t('empty_recent_desc')}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recents.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function GameCard({ game }: { game: GamePreview }) {
  return (
    <Link
      href={`/game/${game.slug}`}
      className="group relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="aspect-[4/3] relative">
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/20 px-2 py-0.5 rounded">
            {game.category}
          </span>
          <h3 className="text-white font-bold text-sm mt-1 line-clamp-1">{game.title}</h3>
        </div>

        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ArrowRight className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/30">
      {icon}
      <h3 className="text-lg font-semibold text-slate-300 mt-4">{title}</h3>
      <p className="text-slate-500 text-sm mt-1 text-center max-w-sm">{description}</p>
      <Link
        href="/"
        className="mt-6 px-5 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
      >
        Explore Games →
      </Link>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="aspect-[4/3] rounded-xl bg-slate-800 animate-pulse" />
      ))}
    </div>
  );
}
