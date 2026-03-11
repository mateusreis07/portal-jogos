'use client';

import { useState } from 'react';
import { AlignLeft, Lightbulb, BookOpen } from 'lucide-react';

interface GameContentTabsProps {
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

export default function GameContentTabs({ title, translations: t, content }: GameContentTabsProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'inst' | 'tips'>('desc');

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-700/50 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('desc')}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm sm:text-base whitespace-nowrap transition-colors border-b-2 ${activeTab === 'desc'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/30'
            }`}
        >
          <AlignLeft className="w-4 h-4" />
          {t.description}
        </button>

        <button
          onClick={() => setActiveTab('inst')}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm sm:text-base whitespace-nowrap transition-colors border-b-2 ${activeTab === 'inst'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/30'
            }`}
        >
          <BookOpen className="w-4 h-4" />
          {t.instructions}
        </button>

        <button
          onClick={() => setActiveTab('tips')}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm sm:text-base whitespace-nowrap transition-colors border-b-2 ${activeTab === 'tips'
              ? 'border-primary text-primary bg-primary/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/30'
            }`}
        >
          <Lightbulb className="w-4 h-4" />
          {t.tips_tricks}
        </button>
      </div>

      {/* Tab Content - ALL content remains in DOM for SEO, just CSS hidden */}
      <div className="p-6 md:p-8">

        {/* Description Tab */}
        <div className={`prose prose-invert max-w-none ${activeTab === 'desc' ? 'block animate-in fade-in slide-in-from-bottom-2 duration-300' : 'hidden'}`}>
          <h2 className="text-xl md:text-2xl font-bold mb-4">{t.description} — {title}</h2>
          <p className="text-slate-300 leading-relaxed text-base md:text-lg">
            {content.description}
          </p>
        </div>

        {/* Instructions Tab */}
        <div className={`prose prose-invert max-w-none ${activeTab === 'inst' ? 'block animate-in fade-in slide-in-from-bottom-2 duration-300' : 'hidden'}`}>
          <h2 className="text-xl md:text-2xl font-bold mb-4">{t.instructions}</h2>
          <div className="text-slate-300 leading-relaxed bg-slate-900/50 p-5 rounded-lg border border-slate-700/50 mb-8 whitespace-pre-wrap">
            {content.instructions}
          </div>
        </div>

        {/* Tips & Tricks Tab */}
        <div className={`prose prose-invert max-w-none ${activeTab === 'tips' ? 'block animate-in fade-in slide-in-from-bottom-2 duration-300' : 'hidden'}`}>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary flex items-center gap-2">
            <Lightbulb className="w-6 h-6" />
            {t.tips_tricks}
          </h2>
          <ul className="text-slate-300 leading-relaxed list-disc pl-5 space-y-3 p-4 bg-slate-900/30 border border-slate-700/30 rounded-lg">
            <li>{t.tip_1}</li>
            <li>{t.tip_2}</li>
            <li className="pb-2">{t.tip_3}</li>
          </ul>

          <div className="mt-6 border-l-4 border-slate-600 pl-4 py-1 italic text-slate-400 text-sm">
            {/* Contexto SEO Oculto ou Extra Dinâmico */}
            Mantenha o foco, aprenda os padrões do jogo e sempre busque melhorar sua melhor pontuação em {title}. Jogue com frequência para dominar cada nível!
          </div>
        </div>

      </div>
    </div>
  );
}
