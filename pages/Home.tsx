import React, { useEffect, useState } from 'react';
import { MovieCard } from '../components/MovieCard';
import { MovieDetails } from '../components/MovieDetails';
import { searchMoviesAI } from '../services/geminiService';
import { Movie } from '../types';
import { Play, Info, Users } from 'lucide-react';

interface HomeProps {
  onStartParty: (movie: Movie) => void;
}

export const Home: React.FC<HomeProps> = ({ onStartParty }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [scifi, setScifi] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImgError, setHeroImgError] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
        // Parallel fetching simulated with Gemini or Mock
        const t1 = searchMoviesAI({ query: "Trending movies 2024", type: 'movie' });
        const t2 = searchMoviesAI({ query: "Best series of all time", type: 'series', minRating: 9 });
        const t3 = searchMoviesAI({ query: "Sci-Fi Classics", genre: 'Sci-Fi' });
        
        const [trendingRes, topRes, scifiRes] = await Promise.all([t1, t2, t3]);
        
        setTrending(trendingRes);
        setTopRated(topRes);
        setScifi(scifiRes);
        setLoading(false);
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    // Reset hero image error when trending movies change
    if (trending.length > 0) {
        setHeroImgError(false);
    }
  }, [trending]);

  if (loading) {
      return (
          <div className="flex items-center justify-center h-screen bg-brand-black text-brand-red">
             <div className="animate-pulse text-2xl font-bold">CineMaster Yükleniyor...</div>
          </div>
      )
  }

  const heroMovie = trending[0];
  
  // Hero image needs to be landscape, so we search for "wallpaper" or "background"
  const heroImageUrl = heroMovie ? `https://tse2.mm.bing.net/th?q=${encodeURIComponent(heroMovie.title + " movie wallpaper 4k")}&w=1280&h=720&c=7&rs=1&p=0` : '';

  return (
    <div className="pb-20">
      {/* Hero Section */}
      {heroMovie && (
        <div className="relative h-[85vh] w-full">
            <div className="absolute inset-0">
                <img 
                    src={!heroImgError ? heroImageUrl : `https://picsum.photos/seed/${heroMovie.id}/1920/1080`}
                    alt={heroMovie.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-[20%] left-0 px-4 md:px-16 max-w-2xl space-y-4">
                <div className="inline-flex items-center px-2 py-1 bg-brand-red/80 text-white text-xs font-bold rounded uppercase tracking-wider">
                    Günün Önerisi
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg leading-tight">
                    {heroMovie.title}
                </h1>
                <p className="text-lg text-gray-200 line-clamp-3 drop-shadow-md">
                    {heroMovie.plot}
                </p>
                <div className="flex items-center gap-4 pt-4">
                    <button className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded font-bold hover:bg-gray-200 transition">
                        <Play fill="currentColor" size={24} /> Oynat
                    </button>
                    <button 
                         onClick={() => onStartParty(heroMovie)}
                         className="flex items-center gap-2 px-8 py-3 bg-brand-red text-white rounded font-bold hover:bg-red-700 transition"
                    >
                         <Users size={24} /> Party Başlat
                    </button>
                    <button 
                        onClick={() => setSelectedMovie(heroMovie)}
                        className="flex items-center gap-2 px-8 py-3 bg-gray-500/40 text-white rounded font-bold backdrop-blur-sm hover:bg-gray-500/60 transition"
                    >
                        <Info size={24} /> Detay
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Rows */}
      <div className="-mt-32 relative z-10 space-y-12 pl-4 md:pl-16">
        <MovieRow title="Trend Olanlar" movies={trending} onSelect={setSelectedMovie} />
        <MovieRow title="IMDB Puanı Yüksek Diziler" movies={topRated} onSelect={setSelectedMovie} />
        <MovieRow title="Bilim Kurgu Klasikleri" movies={scifi} onSelect={setSelectedMovie} />
      </div>

      {selectedMovie && (
        <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} onStartParty={onStartParty} />
      )}
    </div>
  );
};

const MovieRow = ({ title, movies, onSelect }: { title: string, movies: Movie[], onSelect: (m: Movie) => void }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold text-white hover:text-brand-red transition cursor-pointer">{title}</h3>
            <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar pr-16 snap-x">
                {movies.map((movie) => (
                    <div key={movie.id} className="min-w-[160px] md:min-w-[220px] snap-start">
                        <MovieCard movie={movie} onSelect={onSelect} />
                    </div>
                ))}
            </div>
        </div>
    )
}