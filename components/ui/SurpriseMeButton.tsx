'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { gameService } from '@/lib/services/gameService';
import { Dices, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function SurpriseMeButton() {
  const [isShuffling, setIsShuffling] = useState(false);
  const router = useRouter();
  const t = useTranslations('Home');

  const handleSurprise = async () => {
    if (isShuffling) return;
    
    setIsShuffling(true);
    
    try {
      const slug = await gameService.getRandomGameSlug();
      if (slug) {
        // Short delay for visual effect
        setTimeout(() => {
          router.push(`/game/${slug}`);
        }, 800);
      }
    } catch (error) {
      console.error('Failed to get random game:', error);
      setIsShuffling(false);
    }
  };

  return (
    <motion.button
      onClick={handleSurprise}
      disabled={isShuffling}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group overflow-hidden bg-gradient-to-br from-indigo-600 via-primary to-purple-600 p-[1px] rounded-xl shadow-lg shadow-primary/10 transition-all duration-500 ${
        isShuffling ? 'opacity-90 cursor-wait' : 'hover:shadow-primary/30'
      }`}
    >
      <div className="relative bg-[#0a0a20] px-4 py-3 rounded-[11px] flex items-center gap-3 group-hover:bg-transparent transition-colors duration-500">
        <div className={`p-2 rounded-lg bg-primary/20 text-primary group-hover:bg-white/20 group-hover:text-white transition-all duration-500 ${
          isShuffling ? 'animate-bounce' : ''
        }`}>
          {isShuffling ? <Dices size={20} className="animate-spin" /> : <Sparkles size={20} />}
        </div>
        
        <div className="text-left">
          <p className="text-white font-black text-lg leading-none uppercase tracking-tight group-hover:text-white transition-colors">
            {isShuffling ? 'Escolhendo...' : t('surprise_me')}
          </p>
          <p className="text-slate-400 text-xs font-medium group-hover:text-white/80 transition-colors">
            {t('surprise_me_sub')}
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-8 h-8 bg-white/5 rounded-full blur-lg group-hover:bg-white/10 transition-all"></div>
      </div>

      {/* Animated border/glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform"></div>
    </motion.button>
  );
}
