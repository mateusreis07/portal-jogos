'use client';

import { useEffect } from 'react';

export default function AdSidebar() {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="w-full flex justify-center mb-6 sticky top-24 min-h-[600px] overflow-hidden">
      {/* lado direito page jogos */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3311983697432850"
        data-ad-slot="9850238424"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
