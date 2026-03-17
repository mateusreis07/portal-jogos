import { Metadata } from 'next';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'About Us - FoxChaos',
  description: 'Learn more about FoxChaos, the premier destination for free online HTML5 browser games.',
};

export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 md:p-12 shadow-xl">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-8 text-center flex items-center justify-center gap-3">
          <span className="text-primary text-3xl">🎮</span> {t('title')}
        </h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-slate-300 leading-relaxed mb-6">
            {t('description')}
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">{t('mission_title')}</h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            {t('mission_desc')}
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">{t('why_title')}</h2>
          <ul className="list-disc pl-6 space-y-3 text-slate-300 mb-6">
            <li>{t('points.p1')}</li>
            <li>{t('points.p2')}</li>
            <li>{t('points.p3')}</li>
            <li>{t('points.p4')}</li>
          </ul>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50 mt-10">
            <h3 className="text-xl font-bold text-white mb-2">{t('dev_title')}</h3>
            <p className="text-slate-400 text-base m-0">
              {t('dev_desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
