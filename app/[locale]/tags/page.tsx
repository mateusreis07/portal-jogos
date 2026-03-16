import { gameService } from '@/lib/services/gameService';
import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Tags } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Explore Jogos por Tags - FoxChaos',
    description: 'Navegue por todas as categorias e coleções de jogos no FoxChaos. Encontre seus jogos favoritos através de nossas tags organizadas.',
  };
}

export default async function TagsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tags = await gameService.getAllTags();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
          <Tags size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight">Explore Tags</h1>
          <p className="text-slate-400">Encontre exatamente o que você quer jogar</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${tag}`}
            className="group p-4 bg-slate-900 border border-white/5 rounded-xl hover:border-primary/40 hover:bg-slate-800/50 transition-all text-center"
          >
            <span className="text-slate-300 group-hover:text-white font-medium capitalize">
              {tag.replace(/-/g, ' ')}
            </span>
          </Link>
        ))}
      </div>

      {/* SEO Footer for Tags page */}
      <div className="mt-20 p-8 bg-slate-900/50 rounded-3xl border border-white/5">
        <h2 className="text-2xl font-bold text-white mb-4">Por que navegar por tags?</h2>
        <p className="text-slate-400 leading-relaxed max-w-4xl">
          No FoxChaos, organizamos nossa vasta coleção de centenas de jogos em tags específicas para ajudar você a descobrir novas experiências. 
          Se você gosta de jogos de ação rápida, quebra-cabeças relaxantes ou simuladores complexos, nossas tags permitem que você filtre 
          exatamente o conteúdo que lhe interessa. Todos os jogos são gratuitos, sem necessidade de download e funcionam diretamente no seu navegador.
        </p>
      </div>
    </div>
  );
}
