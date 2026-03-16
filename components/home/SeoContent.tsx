import { getTranslations } from 'next-intl/server';
import { Gamepad2, ShieldCheck, Zap, HelpCircle, Tags } from 'lucide-react';
import Link from 'next/link';

export default async function SeoContent() {
  const t = await getTranslations('Seo');
  const tSeo = await getTranslations('HomeSeo');
  const cat = await getTranslations('Categories');

  const faqData = [
    { question: t('q1'), answer: t('a1') },
    { question: t('q2'), answer: t('a2') },
    { question: t('q3'), answer: t('a3') },
    { question: t('q4'), answer: t('a4') },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const categoriesList = [
    'arcade', 'puzzle', 'racing', 'shooting',
    'adventure', 'sports', 'strategy', 'multiplayer'
  ];

  return (
    <section className="bg-[#050510]/50 border-t border-white/5 py-16 px-4 sm:px-6 lg:px-8 mt-12 mb-12 rounded-3xl backdrop-blur-sm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Main Introduction - Now acting as the primary H1 block */}
        <div className="max-w-4xl">
          <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-wider border-l-4 border-primary pl-4">
            {tSeo('h1')}
          </h1>
          <div className="text-slate-400 text-lg leading-relaxed space-y-4">
            <p className="font-medium text-slate-300">{tSeo('h1_sub')}</p>
            <p>{t('description')}</p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-white/5 pt-12">

          <div className="space-y-4 p-8 rounded-2xl bg-[#08081a] border border-white/5 transition-all hover:bg-[#0a0a25] hover:border-primary/20 shadow-lg group">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">{t('subtitle_1')}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              {t('content_1')}
            </p>
          </div>

          <div className="space-y-4 p-8 rounded-2xl bg-[#08081a] border border-white/5 transition-all hover:bg-[#0a0a25] hover:border-secondary/20 shadow-lg group">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">{t('subtitle_2')}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              {t('content_2')}
            </p>
          </div>

          <div className="space-y-4 p-8 rounded-2xl bg-[#08081a] border border-white/5 transition-all hover:bg-[#0a0a25] hover:border-green-500/20 shadow-lg group">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">{t('subtitle_3')}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              {t('content_3')}
            </p>
          </div>

        </div>

        {/* Internal Linking / Categories Tags */}
        <div className="pt-12 border-t border-white/5">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Tags className="w-6 h-6 text-secondary" />
            Explore por Categorias
          </h2>
          <div className="flex flex-wrap gap-3">
            {categoriesList.map((c) => (
              <Link 
                key={c}
                href={`/category/${c}`} 
                className="text-sm border border-white/10 bg-[#08081a] hover:bg-[#0a0a25] hover:border-secondary/40 hover:text-white px-4 py-2 rounded-full transition-all text-slate-300"
              >
                #{cat(c as any)}
              </Link>
            ))}
          </div>
        </div>


        {/* FAQ Section */}
        <div className="pt-12 border-t border-white/5">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-primary" />
            {t('faq_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {faqData.map((faq, index) => (
              <div key={index} className="space-y-3">
                <h4 className="text-lg font-semibold text-slate-100">{faq.question}</h4>
                <p className="text-slate-400 leading-relaxed text-sm border-l-2 border-white/10 pl-4">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
