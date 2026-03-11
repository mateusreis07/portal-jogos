import { gameService } from '@/lib/services/gameService';
import GameGrid from '@/components/game/GameGrid';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params, searchParams }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const t = await getTranslations({ locale, namespace: 'SearchPage' });

  const query = q ? decodeURIComponent(q) : '';

  return {
    title: `${t('title')} ${query ? `- ${query}` : ''} - Arcade Hub`,
    description: t('description', { count: 0 }).replace('0', '100+'),
    robots: {
      index: false,
      follow: true, // Typically we don't index search result pages to avoid duplicate content flags
    }
  };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const query = q ? decodeURIComponent(q) : '';

  const t = await getTranslations({ locale, namespace: 'SearchPage' });

  const results = query ? await gameService.searchGames(query) : [];

  return (
    <div className="flex flex-col gap-8">
      <AdTopBanner />

      <div className="mb-8 border-b border-slate-800 pb-8 mt-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-3">
          🔍 {t('title')}
        </h1>
        {query ? (
          <p className="text-slate-400 text-lg">
            {t('query', { query: query })} <br />
            {t('description', { count: results.length })}
          </p>
        ) : (
          <p className="text-slate-400 text-lg">
            {t('description', { count: 0 })}
          </p>
        )}
      </div>

      {query && results.length > 0 ? (
        <GameGrid games={results} />
      ) : (
        query && (
          <div className="text-center py-20 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
            <h3 className="text-xl text-slate-300 font-medium mb-2">No games found</h3>
            <p className="text-slate-500">Try searching with better keywords or browsing our categories.</p>
          </div>
        )
      )}
    </div>
  );
}
