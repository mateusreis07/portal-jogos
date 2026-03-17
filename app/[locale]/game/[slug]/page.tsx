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
    return { title: 'Jogo Não Encontrado' };
  }

  const translatedGame = applyTranslation(game, locale);
  const categoryLabel = translatedGame.category ? translatedGame.category.charAt(0).toUpperCase() + translatedGame.category.slice(1) : 'Jogos';

  return {
    title: `Jogar ${translatedGame.title} Grátis Online - Jogo de ${categoryLabel}`,
    description: translatedGame.description || `Jogue ${translatedGame.title} grátis online no FoxChaos. Sem download, sem cadastro. Jogue direto no navegador!`,
    openGraph: {
      title: `Jogar ${translatedGame.title} Grátis Online`,
      description: translatedGame.description || `Jogue ${translatedGame.title} grátis no FoxChaos`,
      images: [{ url: translatedGame.thumbnail, width: 600, height: 400, alt: translatedGame.title }],
      type: 'website',
      url: `https://foxchaos.com/${locale}/game/${translatedGame.slug}`,
    },
    alternates: {
      canonical: `/${locale}/game/${translatedGame.slug}`,
      languages: {
        'pt-BR': `/pt-BR/game/${translatedGame.slug}`,
        'en': `/en/game/${translatedGame.slug}`,
      },
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug, locale } = await params;
  let game = await gameService.getGameBySlug(slug);
  const t = await getTranslations('Game');
  const tCat = await getTranslations('Categories');
  const tVibe = await getTranslations('QuickVibe');

  if (!game) {
    notFound();
  }

  const translatedGame = applyTranslation(game, locale);

  const relatedGames = await gameService.getAdvancedRelatedGames(translatedGame, 10);

  const categoryLabel = tCat(translatedGame.category as any) || translatedGame.category;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: translatedGame.title,
    description: translatedGame.description,
    image: translatedGame.thumbnail,
    url: `https://foxchaos.com/${locale}/game/${translatedGame.slug}`,
    genre: categoryLabel,
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    inLanguage: locale,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL', availability: 'https://schema.org/InStock' },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoxChaos', item: 'https://foxchaos.com' },
      { '@type': 'ListItem', position: 2, name: categoryLabel, item: `https://foxchaos.com/${locale}/category/${translatedGame.category}` },
      { '@type': 'ListItem', position: 3, name: translatedGame.title, item: `https://foxchaos.com/${locale}/game/${translatedGame.slug}` },
    ],
  };

  return (
    <div className="flex flex-col gap-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />


      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">

          {/* Render the initial game the user clicked on synchronously for SEO and LCP */}
          <GameView
            game={translatedGame}
            relatedGames={relatedGames}
            translations={{
              description: t('description'),
              instructions: t('instructions'),
              tips_tricks: t('tips_tricks'),
              tip_1: t('tip_1'),
              tip_2: t('tip_2'),
              tip_3: t('tip_3'),
              tags: t('tags'),
              related: t('related')
            }}
            quickVibeLabels={{
              title: tVibe('title'),
              fire: tVibe('fire'),
              mindblown: tVibe('mindblown'),
              funny: tVibe('funny'),
              chill: tVibe('chill'),
              votes: tVibe('votes')
            }}
          />

          {/* Infinite Scroll Feed triggers below the first game */}
          <InfiniteGameFeed
            initialCategory={translatedGame.category}
            initialExcludeIds={[translatedGame.id, ...relatedGames.map(g => g.id)]}
            initialTags={translatedGame.tags}
            locale={locale}
            translations={{
              description: t('description'),
              instructions: t('instructions'),
              tips_tricks: t('tips_tricks'),
              tip_1: t('tip_1'),
              tip_2: t('tip_2'),
              tip_3: t('tip_3'),
              tags: t('tags'),
              related: t('related')
            }}
            quickVibeLabels={{
              title: tVibe('title'),
              fire: tVibe('fire'),
              mindblown: tVibe('mindblown'),
              funny: tVibe('funny'),
              chill: tVibe('chill'),
              votes: tVibe('votes')
            }}
          />

        </div>

        <div className="lg:col-span-1 hidden lg:block">
          {/* Sidebar Ads stay sticky or scroll based on their own internal component logic */}
          <AdSidebar />
        </div>
      </div>
    </div>
  );
}
