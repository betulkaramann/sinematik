
export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number; // 0-10
  posterUrl: string; // Placeholder or generated
  genre: string[];
  director: string;
  plot: string;
  cast: string[];
  type: 'movie' | 'series';
  duration?: string; // e.g., "2h 15m" or "3 Seasons"
}

export interface UserReview {
  movieId: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MovieContextType {
  watchlist: Movie[];
  watched: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: string) => void;
  markAsWatched: (movie: Movie) => void;
  removeFromWatched: (id: string) => void;
  isWatchlisted: (id: string) => boolean;
  isWatched: (id: string) => boolean;
}

export interface SearchFilters {
  query: string;
  genre?: string;
  minRating?: number;
  yearFrom?: number;
  yearTo?: number;
  type?: 'all' | 'movie' | 'series';
}

export interface BattleCategory {
  name: string;
  winner: 'left' | 'right' | 'tie';
  scoreLeft: number;
  scoreRight: number;
  reason: string;
}

export interface BattleResult {
  winner: string; // "left" or "right"
  summary: string;
  categories: BattleCategory[];
}
