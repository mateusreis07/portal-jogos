import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { articleService } from '@/lib/services/articleService';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Articles & News | ArcadeHub',
  description: 'Read the latest news, guides, and articles about the best free online games.',
};

export default async function ArticlesIndexPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale });
  const articles = await articleService.getLatestArticles(locale, 50);

  return (
    <>
      <main className="min-h-screen pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Blog & Artigos
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl">
              Fique por dentro das novidades, descubra os melhores jogos e leia nossos guias completos.
            </p>
          </header>

          {articles.length === 0 ? (
            <div className="text-slate-400 py-12 text-center bg-slate-800/20 rounded-xl border border-slate-800">
              Nenhum artigo encontrado no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/${locale}/article/${article.slug}`}
                  className="group block bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="relative w-full h-48 bg-slate-900 overflow-hidden">
                    {article.image_url ? (
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700">
                        SEM IMAGEM
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded">
                        {article.target_tag.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h2>

                    {article.meta_description && (
                      <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                        {article.meta_description}
                      </p>
                    )}

                    <div className="flex items-center text-xs text-slate-500 mt-auto">
                      <time dateTime={article.created_at}>
                        {new Date(article.created_at).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
