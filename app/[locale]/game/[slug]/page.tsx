import { gameService } from '@/lib/services/gameService';
import GameGrid from '@/components/game/GameGrid';
import GameView from '@/components/game/GameView';
import InfiniteGameFeed from '@/components/game/InfiniteGameFeed';
import AdSidebar from '@/components/ads/AdSidebar';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import translationsData from '@/data/translations.json';

// Utility to apply translations
const applyTranslation = (game: any, locale: string) => {
  const langKey = locale === 'pt-BR' ? 'pt' : locale;
  const translation = (translationsData as any)[game.id]?.[langKey] || (translationsData as any)[game.id]?.en || { description: game.description, instructions: game.instructions };
  return { ...game, description: translation.description, instructions: translation.instructions };
};

interface GamePageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  let game: any = await gameService.getGameBySlug(slug);

  if (!game) {
    return { title: 'Game Not Found' };
  }

  const translatedGame = applyTranslation(game, locale);

  return {
    title: `Play ${translatedGame.title} Online Free - Browser Game`,
    description: translatedGame.description,
    openGraph: {
      title: `Play ${translatedGame.title} Online Free`,
      description: translatedGame.description,
      images: [{ url: translatedGame.thumbnail, width: 600, height: 400, alt: translatedGame.title }],
      type: 'website',
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug, locale } = await params;
  let game = await gameService.getGameBySlug(slug);
  const t = await getTranslations('Game');

  if (!game) {
    notFound();
  }

  const translatedGame = applyTranslation(game, locale);

  const relatedGames = await gameService.getRelatedGames(translatedGame.category, translatedGame.slug, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: translatedGame.title,
    description: translatedGame.description,
    image: translatedGame.thumbnail,
    url: `https://arcadehub.example.com/game/${translatedGame.slug}`,
    genre: translatedGame.category,
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <div className="flex flex-col gap-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AdTopBanner />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">

          {/* Render the initial game the user clicked on synchronously for SEO and LCP */}
          <GameView
            game={translatedGame}
            translations={{
              description: t('description'),
              instructions: t('instructions'),
              tips_tricks: t('tips_tricks'),
              tip_1: t('tip_1'),
              tip_2: t('tip_2'),
              tip_3: t('tip_3')
            }}
          />

          {/* Infinite Scroll Feed triggers below the first game */}
          <InfiniteGameFeed
            initialCategory={translatedGame.category}
            initialExcludeIds={[translatedGame.id]}
            locale={locale}
            translations={{
              description: t('description'),
              instructions: t('instructions'),
              tips_tricks: t('tips_tricks'),
              tip_1: t('tip_1'),
              tip_2: t('tip_2'),
              tip_3: t('tip_3')
            }}
          />

        </div>

        <div className="lg:col-span-1 hidden lg:block">
          {/* Sidebar Ads stay sticky or scroll based on their own internal component logic */}
          <AdSidebar />
        </div>
      </div>

      <div className="mt-12 pt-12 border-t border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mb-8">
          <span className="bg-primary w-2 h-6 rounded-full inline-block"></span>
          {t('related')} — <span className="capitalize">{translatedGame.category}</span>
        </h2>
        <GameGrid games={relatedGames} />
      </div>
    </div>
  );
}
