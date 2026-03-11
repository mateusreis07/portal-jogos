import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { articleService } from '@/lib/services/articleService';
import { gameService } from '@/lib/services/gameService';
import GameGrid from '@/components/game/GameGrid';
import Image from 'next/image';

interface ArticlePageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({ params: { locale, slug } }: ArticlePageProps): Promise<Metadata> {
  const article = await articleService.getArticleBySlug(slug, locale);

  if (!article) {
    return {
      title: 'Article Not Found | ArcadeHub',
    };
  }

  return {
    title: `${article.title} | ArcadeHub`,
    description: article.meta_description || article.title,
    openGraph: {
      title: article.title,
      description: article.meta_description || article.title,
      type: 'article',
      url: `https://arcadehub.com/${locale}/article/${slug}`, // Replace with your actual domain
      images: article.image_url ? [
        {
          url: article.image_url,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.meta_description || article.title,
      images: article.image_url ? [article.image_url] : [],
    },
  };
}

export default async function ArticlePage({ params: { locale, slug } }: ArticlePageProps) {
  const t = await getTranslations({ locale });
  const article = await articleService.getArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  // Fetch games based on the article's target_tag
  const relatedGames = await gameService.getGamesByTag(article.target_tag, 40);

  return (
    <main className="min-h-screen pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <article className="mb-16">
          <header className="mb-10 text-center max-w-4xl mx-auto">
            {/* Optional Category/Tag Pill */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded-md inline-block">
                {article.target_tag.replace('-', ' ')}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              {article.title}
            </h1>

            {article.meta_description && (
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                {article.meta_description}
              </p>
            )}

            <div className="mt-8 flex items-center justify-center text-sm text-slate-500 gap-4">
              <time dateTime={article.created_at}>
                {new Date(article.created_at).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span>•</span>
              <span>ArcadeHub Editor</span>
            </div>
          </header>

          {article.image_url && (
            <div className="relative w-full h-[40vh] md:h-[60vh] max-w-5xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent"></div>
            </div>
          )}

          <div className="max-w-3xl mx-auto px-4 sm:px-0">
            {/*
                We use prose logic exactly like in the implementation plan.
                This assumes the 'content' column from Supabase has raw HTML (like from a rich text editor).
                To protect against XSS, ensure your supabase data is sanitized before inserting,
                or use a library like DOMPurify if users can write it directly (not needed if only admins write).
              */}
            <div
              className="prose prose-invert prose-lg md:prose-xl max-w-none
                           prose-headings:font-bold prose-headings:text-white
                           prose-a:text-primary hover:prose-a:text-primary/80
                           prose-img:rounded-xl prose-img:shadow-lg
                           text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        {/* Related Games Grid based on the article's target_tag */}
        {relatedGames.length > 0 && (
          <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-800/50">
            <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3 mb-8">
              <span className="bg-primary w-2 h-8 rounded-full inline-block"></span>
              Play {article.target_tag.replace('-', ' ')} Games
            </h2>
            <GameGrid games={relatedGames} />
          </div>
        )}

      </div>
    </main>
  );
}
