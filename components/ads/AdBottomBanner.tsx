'use client';

import { useEffect } from 'react';

export default function AdBottomBanner() {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="w-full flex justify-center min-h-[90px] overflow-hidden">
      {/* embaixo dos jogos recomendados */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3311983697432850"
        data-ad-slot="9327494249"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
