'use client';

const FAVORITES_KEY = 'arcadehub_favorites';
const RECENT_KEY = 'arcadehub_recently_played';
const MAX_RECENT = 20;

export interface RecentEntry {
  gameId: string;
  playedAt: string;
}

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const favoritesService = {
  getFavorites(): string[] {
    return getStorage<string[]>(FAVORITES_KEY, []);
  },

  isFavorite(gameId: string): boolean {
    return this.getFavorites().includes(gameId);
  },

  addFavorite(gameId: string): void {
    const favs = this.getFavorites();
    if (!favs.includes(gameId)) {
      setStorage(FAVORITES_KEY, [...favs, gameId]);
    }
  },

  removeFavorite(gameId: string): void {
    const favs = this.getFavorites().filter((id) => id !== gameId);
    setStorage(FAVORITES_KEY, favs);
  },

  toggleFavorite(gameId: string): boolean {
    if (this.isFavorite(gameId)) {
      this.removeFavorite(gameId);
      return false;
    }
    this.addFavorite(gameId);
    return true;
  },

  getRecentlyPlayed(): RecentEntry[] {
    return getStorage<RecentEntry[]>(RECENT_KEY, []);
  },

  addToRecentlyPlayed(gameId: string): void {
    let recents = this.getRecentlyPlayed().filter((r) => r.gameId !== gameId);
    recents.unshift({ gameId, playedAt: new Date().toISOString() });
    if (recents.length > MAX_RECENT) recents = recents.slice(0, MAX_RECENT);
    setStorage(RECENT_KEY, recents);
  },
};
