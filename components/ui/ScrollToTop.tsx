'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button only when user reaches the bottom area of the page
  const toggleVisibility = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollPos = window.scrollY + window.innerHeight;
    
    // Show if we are within 300px of the bottom
    if (scrollHeight - scrollPos < 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[60] p-4 rounded-2xl bg-primary text-white shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all group overflow-hidden"
          aria-label="Voltar para o topo"
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          
          <ChevronUp className="relative z-10 w-6 h-6 animate-[bounce_2s_infinite]" />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
