'use client';

import { AlignLeft, Lightbulb, BookOpen } from 'lucide-react';

interface GameContentProps {
  title: string;
  translations: {
    description: string;
    instructions: string;
    tips_tricks: string;
    tip_1: string;
    tip_2: string;
    tip_3: string;
  };
  content: {
    description: string;
    instructions: string;
  };
}

export default function GameContentTabs({ title, translations: t, content }: GameContentProps) {
  // Alterado: Removemos as 'tabs' (abas) que escondiam conteúdo, 
  // pois o Google AdSense penaliza conteúdo oculto por CSS ('display: none') 
  // qualificando a página como "Conteúdo Superficial" (Thin Content).
  // Agora o conteúdo é exibido em blocos empilhados/lado a lado.

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Description Block */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 md:p-8 w-full">
        <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
          <AlignLeft className="hidden sm:block w-6 h-6 text-primary" />
          {t.description} — {title}
        </h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 leading-relaxed text-base md:text-lg">
            {content.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Instructions Block */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
            <BookOpen className="hidden sm:block w-6 h-6 text-emerald-500" />
            {t.instructions}
          </h2>
          <div className="prose prose-invert max-w-none">
            <div className="text-slate-300 leading-relaxed bg-slate-900/50 p-5 rounded-lg border border-slate-700/50 break-words whitespace-pre-wrap">
              {content.instructions}
            </div>
          </div>
        </div>

        {/* Tips & Tricks Block */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-amber-500 flex items-center gap-3">
            <Lightbulb className="hidden sm:block w-6 h-6" />
            {t.tips_tricks}
          </h2>
          <div className="prose prose-invert max-w-none">
            <ul className="text-slate-300 leading-relaxed list-disc pl-5 space-y-3 px-2 py-2">
              <li>{t.tip_1}</li>
              <li>{t.tip_2}</li>
              <li>{t.tip_3}</li>
            </ul>
            <div className="mt-4 border-l-4 border-amber-500/50 pl-4 py-1 italic text-slate-400 text-sm">
               Dica Pro: Domine as mecânicas básicas nas fases iniciais de {title} para garantir uma progressão mais tranquila nos níveis avançados!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
