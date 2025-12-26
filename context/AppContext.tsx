import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie, MovieContextType } from '../types';

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [watched, setWatched] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('watched');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);

  const addToWatchlist = (movie: Movie) => {
    if (!watchlist.find(m => m.id === movie.id)) {
      setWatchlist([...watchlist, movie]);
    }
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlist(watchlist.filter(m => m.id !== id));
  };

  const markAsWatched = (movie: Movie) => {
    if (!watched.find(m => m.id === movie.id)) {
      setWatched([...watched, movie]);
      removeFromWatchlist(movie.id); // Remove from watchlist if watched
    }
  };

  const removeFromWatched = (id: string) => {
    setWatched(watched.filter(m => m.id !== id));
  };

  const isWatchlisted = (id: string) => !!watchlist.find(m => m.id === id);
  const isWatched = (id: string) => !!watched.find(m => m.id === id);

  return (
    <MovieContext.Provider value={{
      watchlist,
      watched,
      addToWatchlist,
      removeFromWatchlist,
      markAsWatched,
      removeFromWatched,
      isWatchlisted,
      isWatched
    }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) throw new Error("useMovies must be used within a MovieProvider");
  return context;
};