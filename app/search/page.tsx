import { gameService } from '@/lib/services/gameService';
import GameGrid from '@/components/game/GameGrid';
import AdTopBanner from '@/components/ads/AdTopBanner';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  return {
    title: `Search results for "${query}" - Arcade Hub`,
    robots: {
      index: false,
      follow: true, // Typically we don't index search result pages to avoid duplicate content flags
    }
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  // Basic search:
  const results = query ? await gameService.searchGames(query) : [];

  return (
    <div className="flex flex-col gap-8">
      <AdTopBanner />

      <div className="mb-4 border-b border-slate-800 pb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Search Results
        </h1>
        {query ? (
          <p className="text-slate-400 text-lg">
            Found {results.length} games matching <span className="text-white font-medium">"{query}"</span>
          </p>
        ) : (
          <p className="text-slate-400 text-lg">Enter a search term to find games.</p>
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
