'use client';

import { useRef, useState, useEffect } from 'react';
import { Maximize, Share2, Check } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

interface GamePlayerProps {
  gameId: string;
  gameUrl: string;
  title: string;
}

export default function GamePlayer({ gameId, gameUrl, title }: GamePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

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

  const handleShare = async () => {
    const url = window.location.href;
    if (canShare) {
      try {
        await navigator.share({
          title: `Play ${title} on ArcadeHub`,
          url: url
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Container do Iframe */}
      <div className="w-full relative bg-black aspect-[4/3] md:aspect-[16/9] lg:h-[600px] lg:aspect-auto rounded-xl overflow-hidden shadow-2xl border border-slate-800">
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

        {/* Decorative subtle overlay border */}
        <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none"></div>
      </div>

      {/* Action Bar (Barra de Ferramentas Inferior) */}
      <div className="flex items-center justify-between bg-slate-800/40 border border-slate-700/50 p-2 sm:p-3 rounded-xl mt-1 backdrop-blur-sm">
        <div className="flex items-center">
          {/* Reusing FavoriteButton component here */}
          <FavoriteButton gameId={gameId} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600 text-slate-300 hover:text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            title="Share Game"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={handleFullscreen}
            className="flex items-center gap-2 bg-primary/20 hover:bg-primary text-primary hover:text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm font-medium border border-primary/20"
            title="Full Screen"
          >
            <Maximize className="w-4 h-4" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
