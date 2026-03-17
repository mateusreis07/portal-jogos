'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const t = useTranslations('Footer'); // Reusing some strings or adding new ones

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
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
          <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Cookie className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-white font-bold tracking-tight">Cookies & Privacy</h3>
              </div>
              <button 
                onClick={() => setShow(false)}
                className="text-slate-500 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed">
              We use cookies to improve your experience, analyze traffic, and show relevant ads via Google AdSense. 
              By continuing to browse, you agree to our 
              <Link href="/privacy" className="text-primary hover:underline mx-1">Privacy Policy</Link>.
            </p>

            <div className="flex gap-3 mt-2">
              <button
                onClick={accept}
                className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
              >
                Accept All
              </button>
              <button
                onClick={() => setShow(false)}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-xl transition-all"
              >
                Settings
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
