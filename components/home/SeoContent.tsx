import { getTranslations } from 'next-intl/server';
import { Gamepad2, ShieldCheck, Zap } from 'lucide-react';

export default async function SeoContent() {
  const t = await getTranslations('Seo');

  return (
    <section className="bg-slate-900 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 mt-12 rounded-t-3xl">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Introduction */}
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold text-white mb-4">{t('title')}</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-slate-800/50">

          <div className="space-y-4 p-6 rounded-2xl bg-slate-800/20 border border-slate-700/50 hover:bg-slate-800/40 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">{t('subtitle_1')}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              {t('content_1')}
            </p>
          </div>

          <div className="space-y-4 p-6 rounded-2xl bg-slate-800/20 border border-slate-700/50 hover:bg-slate-800/40 transition-colors">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">{t('subtitle_2')}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              {t('content_2')}
            </p>
          </div>

          <div className="space-y-4 p-6 rounded-2xl bg-slate-800/20 border border-slate-700/50 hover:bg-slate-800/40 transition-colors">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">Seguro e Confiável</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Nossa plataforma garante um ambiente seguro para jogadores de todas as idades. Sem arquivos maliciosos, sem exigência de conta bancária e sempre testado por nossa equipe de edição para máxima diversão.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
