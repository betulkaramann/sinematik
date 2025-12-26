import React, { useEffect, useState } from 'react';
import { Movie } from '../types';
import { X, Star, Calendar, Clock, Film, User, Heart, PlayCircle, ImageOff, Users } from 'lucide-react';
import { useMovies } from '../context/AppContext';
import { getMovieAnalysis } from '../services/geminiService';

interface MovieDetailsProps {
  movie: Movie | null;
  onClose: () => void;
  onStartParty: (movie: Movie) => void;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose, onStartParty }) => {
  const { isWatchlisted, addToWatchlist, removeFromWatchlist, isWatched, markAsWatched } = useMovies();
  const [analysis, setAnalysis] = useState<string>("");
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (movie) {
        setLoadingAnalysis(true);
        setAnalysis("");
        setImgError(false);
        getMovieAnalysis(movie.title)
            .then(text => setAnalysis(text))
            .catch(() => setAnalysis("Yüklenemedi."))
            .finally(() => setLoadingAnalysis(false));
    }
  }, [movie]);

  if (!movie) return null;

  const inWatchlist = isWatchlisted(movie.id);
  const watched = isWatched(movie.id);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-[#181818] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-white/10 flex flex-col md:flex-row">
        
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-white/20 transition text-white"
        >
            <X size={24} />
        </button>

        {/* Poster Image */}
        <div className="w-full md:w-2/5 h-[300px] md:h-auto relative bg-[#111] flex items-center justify-center">
           {!imgError ? (
               <img 
                 src={movie.posterUrl} 
                 alt={movie.title} 
                 className="w-full h-full object-cover" 
                 referrerPolicy="no-referrer"
                 onError={() => setImgError(true)}
               />
           ) : (
               <div className="flex flex-col items-center text-gray-500">
                   <ImageOff size={48} className="mb-2 opacity-50" />
                   <span>Resim Yok</span>
               </div>
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#181818]"></div>
        </div>

        {/* Content */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col text-gray-100">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">{movie.title}</h2>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                <span className="text-green-400 font-bold flex items-center gap-1">
                    <Star size={16} fill="currentColor" /> {movie.rating}/10 IMDB
                </span>
                <span className="flex items-center gap-1"><Calendar size={16}/> {movie.year}</span>
                <span className="flex items-center gap-1"><Clock size={16}/> {movie.duration || 'N/A'}</span>
                <span className="uppercase border border-gray-600 px-2 py-0.5 rounded text-xs tracking-wider">{movie.type}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mb-8">
                <div className="flex gap-3">
                    <button className="flex-1 bg-white text-black py-3 rounded font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2">
                        <PlayCircle size={20} /> İzle
                    </button>
                    <button 
                        onClick={() => {
                            onClose();
                            onStartParty(movie);
                        }}
                        className="flex-1 bg-brand-red text-white py-3 rounded font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                        <Users size={20} /> Watch Party
                    </button>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                        className={`flex-1 border py-2 rounded font-bold transition flex items-center justify-center gap-2 ${inWatchlist ? 'bg-white/10 text-white border-transparent' : 'border-gray-500 hover:border-white'}`}
                    >
                        {inWatchlist ? 'Listeden Çıkar' : 'Listeme Ekle'}
                    </button>
                     <button 
                        onClick={() => markAsWatched(movie)}
                        className={`p-2 border rounded hover:border-white transition ${watched ? 'text-green-500 border-green-500' : 'border-gray-500'}`}
                        title="İzlendi"
                    >
                        <Heart size={20} fill={watched ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            {/* Gemini Analysis */}
            <div className="mb-6 bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2 text-purple-400 font-semibold text-xs uppercase tracking-wider">
                    <Star size={12} /> AI Değerlendirmesi
                </div>
                <p className="text-sm leading-relaxed text-gray-300 italic">
                    {loadingAnalysis ? "Yapay zeka filmi analiz ediyor..." : `"${analysis}"`}
                </p>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
                {movie.plot}
            </p>

            <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                    <span className="text-gray-500 min-w-[80px]">Türler:</span>
                    <span className="text-white">{movie.genre.join(', ')}</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-gray-500 min-w-[80px]">Yönetmen:</span>
                    <span className="text-white">{movie.director}</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-gray-500 min-w-[80px]">Oyuncular:</span>
                    <span className="text-white">{movie.cast.join(', ')}</span>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};