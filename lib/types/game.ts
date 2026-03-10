export type GameCategory =
  | 'arcade'
  | 'puzzle'
  | 'racing'
  | 'shooting'
  | 'adventure'
  | 'sports'
  | 'strategy'
  | 'multiplayer';

export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructions: string;
  category: GameCategory;
  thumbnail: string;
  gameUrl: string;
  createdAt: string;
  views: number;
}
