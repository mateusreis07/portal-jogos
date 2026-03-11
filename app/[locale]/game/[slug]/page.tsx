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

interface GamePageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await gameService.getGameBySlug(slug);

  if (!game) {
    return { title: 'Game Not Found' };
  }

  return {
    title: `Play ${game.title} Online Free - Browser Game`,
    description: game.description,
    openGraph: {
      title: `Play ${game.title} Online Free`,
      description: game.description,
      images: [{ url: game.thumbnail, width: 600, height: 400, alt: game.title }],
      type: 'website',
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = await gameService.getGameBySlug(slug);
  const t = await getTranslations('Game');

  if (!game) {
    notFound();
  }

  const relatedGames = await gameService.getRelatedGames(game.category, game.slug, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description,
    image: game.thumbnail,
    url: `https://arcadehub.example.com/game/${game.slug}`,
    genre: game.category,
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
            game={game}
            translations={{
              description: t('description'),
              instructions: t('instructions')
            }}
          />

          {/* Infinite Scroll Feed triggers below the first game */}
          <InfiniteGameFeed
            initialCategory={game.category}
            initialExcludeIds={[game.id]}
            translations={{
              description: t('description'),
              instructions: t('instructions')
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
          {t('related')} — <span className="capitalize">{game.category}</span>
        </h2>
        <GameGrid games={relatedGames} />
      </div>
    </div>
  );
}
