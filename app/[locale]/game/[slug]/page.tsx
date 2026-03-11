import { gameService } from '@/lib/services/gameService';
import GamePlayer from '@/components/game/GamePlayer';
import GameGrid from '@/components/game/GameGrid';
import FavoriteButton from '@/components/game/FavoriteButton';
import TrackRecentlyPlayed from '@/components/game/TrackRecentlyPlayed';
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

      {/* Track this game as recently played */}
      <TrackRecentlyPlayed gameId={game.id} />

      <AdTopBanner />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-8">

          {/* Game Header with Favorite Button */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Link
                href={`/category/${game.category}`}
                className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded-md hover:bg-primary/30 transition-colors"
              >
                {game.category}
              </Link>
            </div>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                {game.title}
              </h1>
              <FavoriteButton gameId={game.id} />
            </div>
          </div>

          <GamePlayer gameUrl={game.gameUrl} title={game.title} />

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 md:p-8">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">{t('description')} — {game.title}</h2>
              <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                {game.description}
              </p>

              <h3 className="text-xl font-bold mb-3 text-primary">{t('instructions')}</h3>
              <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 mb-8">
                {game.instructions}
              </p>

              <h3 className="text-xl font-bold mb-3 text-primary">Tips & Tricks</h3>
              <ul className="text-slate-300 leading-relaxed list-disc pl-5 space-y-2">
                <li>Practice the controls before jumping into the action.</li>
                <li>Take regular breaks to rest your eyes.</li>
                <li>Challenge your friends to beat your high score!</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 hidden lg:block">
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
