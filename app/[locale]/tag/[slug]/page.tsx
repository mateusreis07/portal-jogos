import { gameService } from '@/lib/services/gameService';
import GameGrid from '@/components/game/GameGrid';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SeoFooter from '@/components/ui/SeoFooter';
import { Tags } from 'lucide-react';

interface TagPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  const tagTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `Jogar Jogos de ${tagTitle} Grátis Online - FoxChaos`,
    description: `Os melhores jogos com a tag ${tagTitle} para jogar online gratuitamente no seu navegador. Diversão sem download no FoxChaos.`,
    alternates: {
      canonical: `/${locale}/tag/${slug}`,
      languages: {
        'pt-BR': `/pt-BR/tag/${slug}`,
        'en': `/en/tag/${slug}`,
      },
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug, locale } = await params;
  const games = await gameService.getGamesByTag(slug);

  const tPage = await getTranslations({ locale, namespace: 'TagPage' });
  const tagTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoxChaos', item: 'https://foxchaos.com' },
      { '@type': 'ListItem', position: 2, name: tagTitle, item: `https://foxchaos.com/${locale}/tag/${slug}` },
    ],
  };

  return (
    <div className="flex flex-col gap-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <AdTopBanner />

      <div className="mb-8 border-b border-slate-800 pb-8 mt-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
          {tPage('title', { tag: tagTitle })}
        </h1>
        <p className="text-slate-400 text-lg">
          {tPage('description', { count: games.length, tag: tagTitle.toLowerCase() })}
        </p>
      </div>

      {games.length > 0 ? (
        <GameGrid games={games} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-800/20 rounded-2xl border border-slate-800/50">
          <p className="text-slate-400 text-lg">No games found for this tag yet. Check back soon!</p>
        </div>
      )}

      <SeoFooter 
        title={tagTitle}
        description={`Os jogos com a tag ${tagTitle} no FoxChaos oferecem experiências únicas e diversificadas. Confira nossa seleção de ${games.length} jogos agora.`}
        count={games.length}
        icon={Tags}
      />
    </div>
  );
}
