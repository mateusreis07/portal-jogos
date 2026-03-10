interface GamePlayerProps {
  gameUrl: string;
  title: string;
}

export default function GamePlayer({ gameUrl, title }: GamePlayerProps) {
  return (
    <div className="w-full relative bg-black aspect-[4/3] md:aspect-[16/9] lg:h-[600px] lg:aspect-auto rounded-xl overflow-hidden shadow-2xl border border-slate-800 group">
      <iframe
        src={gameUrl}
        title={title}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="fullscreen; autoplay; payment"
        className="w-full h-full"
        loading="lazy"
      ></iframe>

      {/* Decorative subtle overlay border */}
      <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none"></div>
    </div>
  );
}
