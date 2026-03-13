import { gameService } from '@/lib/services/gameService';
import GameGrid from '@/components/game/GameGrid';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface PopularPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PopularPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PopularPage' });

  return {
    title: `${t('title')} - FoxChaos`,
    description: t('description', { count: 100 }),
  };
}

export default async function PopularPage({ params }: PopularPageProps) {
  const { locale } = await params;
  const games = await gameService.getPopularGames(100);
  const t = await getTranslations({ locale, namespace: 'PopularPage' });

  return (
    <div className="flex flex-col gap-8">
      <AdTopBanner />

      <div className="mb-8 border-b border-slate-800 pb-8 mt-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
          🔥 {t('title')}
        </h1>
        <p className="text-slate-400 text-lg">
          {t('description', { count: games.length })}
        </p>
      </div>

      <GameGrid games={games} />
    </div>
  );
}
