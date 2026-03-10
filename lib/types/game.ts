export type GameCategory = string;

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
