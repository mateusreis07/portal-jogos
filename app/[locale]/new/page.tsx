import { gameService } from '@/lib/services/gameService';
import GameGrid from '@/components/game/GameGrid';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface NewPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: NewPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'NewPage' });

  return {
    title: `${t('title')} - FoxChaos`,
    description: t('description', { count: 100 }),
  };
}

export default async function NewGamesPage({ params }: NewPageProps) {
  const { locale } = await params;
  const games = await gameService.getNewGames(100);
  const t = await getTranslations({ locale, namespace: 'NewPage' });

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoxChaos', item: 'https://foxchaos.com' },
      { '@type': 'ListItem', position: 2, name: t('title'), item: `https://foxchaos.com/${locale}/new` },
    ],
  };

  return (
    <div className="flex flex-col gap-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <AdTopBanner />

      <div className="mb-8 border-b border-slate-800 pb-8 mt-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
          🆕 {t('title')}
        </h1>
        <p className="text-slate-400 text-lg">
          {t('description', { count: games.length })}
        </p>
      </div>

      <GameGrid games={games} />
    </div>
  );
}
