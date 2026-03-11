'use client';

import { useRef } from 'react';
import { Maximize } from 'lucide-react';

interface GamePlayerProps {
  gameUrl: string;
  title: string;
}

export default function GamePlayer({ gameUrl, title }: GamePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if ((iframeRef.current as any).webkitRequestFullscreen) { /* Safari */
        (iframeRef.current as any).webkitRequestFullscreen();
      } else if ((iframeRef.current as any).msRequestFullscreen) { /* IE11 */
        (iframeRef.current as any).msRequestFullscreen();
      }
    }
  };

  return (
    <div className="w-full relative bg-black aspect-[4/3] md:aspect-[16/9] lg:h-[600px] lg:aspect-auto rounded-xl overflow-hidden shadow-2xl border border-slate-800 group group/player">
      <iframe
        ref={iframeRef}
        src={gameUrl}
        title={title}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="fullscreen; autoplay; payment"
        className="w-full h-full bg-black block"
        loading="lazy"
      ></iframe>

      {/* Fullscreen Button Overlay */}
      <button
        onClick={handleFullscreen}
        className="absolute top-4 right-4 bg-slate-900/80 hover:bg-primary text-white p-2.5 rounded-lg border border-slate-700/50 backdrop-blur-md opacity-0 group-hover/player:opacity-100 transition-all duration-300 shadow-lg hover:scale-105 z-10"
        title="Full Screen"
        aria-label="Play Fullscreen"
      >
        <Maximize className="w-5 h-5" />
      </button>

      {/* Decorative subtle overlay border */}
      <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none"></div>
    </div>
  );
}
