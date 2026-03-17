'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [view, setView] = useState<'banner' | 'settings'>('banner');
  const t = useTranslations('CookieConsent');

  const [settings, setSettings] = useState({
    necessary: true,
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent-settings');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    } else {
      try {
        setSettings(JSON.parse(consent));
      } catch (e) {
        // Fallback
      }
    }
  }, []);

  const saveSettings = (newSettings: typeof settings) => {
    localStorage.setItem('cookie-consent-settings', JSON.stringify(newSettings));
    setShow(false);
  };

  const acceptAll = () => {
    const allOn = { necessary: true, analytics: true, marketing: true };
    setSettings(allOn);
    saveSettings(allOn);
  };

  const rejectAll = () => {
    const onlyNecessary = { necessary: true, analytics: false, marketing: false };
    setSettings(onlyNecessary);
    saveSettings(onlyNecessary);
  };

  const handleToggle = (key: keyof typeof settings) => {
    if (key === 'necessary') return; // Cannot toggle necessary
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100]"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex flex-col gap-5 overflow-hidden">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/20 rounded-xl">
                  <Cookie className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-bold tracking-tight">{t('title')}</h3>
                  {view === 'settings' && (
                    <button 
                      onClick={() => setView('banner')}
                      className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-1 mt-1 opacity-80 hover:opacity-100 transition-opacity"
                    >
                      ← Voltar
                    </button>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setShow(false)}
                className="text-slate-500 hover:text-white transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {view === 'banner' ? (
              <>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t('description')}
                  <Link href="/privacy" className="text-primary hover:underline ml-1">{t('privacy_policy')}</Link>.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={acceptAll}
                    className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                  >
                    {t('accept_all')}
                  </button>
                  <button
                    onClick={() => setView('settings')}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group"
                  >
                    {t('settings')}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="space-y-3">
                  {(['necessary', 'analytics', 'marketing'] as const).map((id) => (
                    <div 
                      key={id}
                      onClick={() => handleToggle(id)}
                      className={`flex items-center gap-4 p-3 rounded-2xl border transition-all cursor-pointer ${
                        settings[id] ? 'bg-primary/5 border-primary/20' : 'bg-slate-800/20 border-white/5'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        settings[id] ? 'bg-primary' : 'bg-slate-700'
                      }`}>
                        {settings[id] && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white capitalize">{t(`categories.${id}.title`)}</span>
                          {id === 'necessary' && (
                            <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter">Obrigatório</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {t(`categories.${id}.description`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => saveSettings(settings)}
                    className="w-full py-3 bg-white text-slate-900 font-bold rounded-2xl transition-all hover:bg-slate-200 active:scale-[0.98]"
                  >
                    {t('confirm_choices')}
                  </button>
                  <button
                    onClick={rejectAll}
                    className="w-full py-2 text-slate-500 text-xs font-medium hover:text-slate-300 transition-colors"
                  >
                    {t('reject_all')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
