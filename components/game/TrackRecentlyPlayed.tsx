'use client';

import { useEffect } from 'react';
import { favoritesService } from '@/lib/services/favoritesService';

export default function TrackRecentlyPlayed({ gameId }: { gameId: string }) {
  useEffect(() => {
    favoritesService.addToRecentlyPlayed(gameId);
  }, [gameId]);

  return null;
}
