import React, { useState } from 'react';
import { Movie } from '../types';
import { Star, Plus, Check, PlayCircle, Info, ImageOff } from 'lucide-react';
import { useMovies } from '../context/AppContext';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
  const { isWatchlisted, isWatched, addToWatchlist, removeFromWatchlist, markAsWatched } = useMovies();
  const [imgError, setImgError] = useState(false);
  
  const inWatchlist = isWatchlisted(movie.id);
  const watched = isWatched(movie.id);

  return (
    <div className="group relative w-full aspect-[2/3] bg-brand-dark rounded-md overflow-hidden transition-all duration-300 hover:scale-105 hover:z-20 shadow-lg cursor-pointer">
      {!imgError ? (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
          loading="lazy"
          referrerPolicy="no-referrer"
          onClick={() => onSelect(movie)}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#222] text-gray-500 p-4 text-center" onClick={() => onSelect(movie)}>
            <ImageOff size={32} className="mb-2 opacity-50" />
            <span className="text-xs">{movie.title}</span>
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        
        <h3 className="text-white font-bold text-lg leading-tight mb-1 drop-shadow-md">{movie.title}</h3>
        
        <div className="flex items-center gap-2 text-xs text-green-400 font-semibold mb-2">
          <span className="flex items-center gap-1 bg-black/50 px-1 rounded">
             <Star size={10} fill="currentColor" /> {movie.rating}
          </span>
          <span className="text-gray-300 border border-gray-600 px-1 rounded">{movie.year}</span>
          <span className="text-gray-300 uppercase text-[10px] border border-gray-600 px-1 rounded">{movie.type === 'series' ? 'TV' : 'Film'}</span>
        </div>

        <div className="flex items-center gap-2 justify-between mt-2">
            <button 
                onClick={(e) => { e.stopPropagation(); onSelect(movie); }}
                className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition"
                title="Detaylar"
            >
                <Info size={16} />
            </button>

            <div className="flex gap-2">
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie);
                    }}
                    className={`p-2 rounded-full border border-gray-400 hover:border-white transition ${inWatchlist ? 'bg-brand-red border-brand-red text-white' : 'text-white'}`}
                    title={inWatchlist ? "Listeden Çıkar" : "Listeye Ekle"}
                >
                    {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
                </button>
                
                <button 
                    onClick={(e) => {
                         e.stopPropagation();
                         markAsWatched(movie);
                    }}
                    className={`p-2 rounded-full border border-gray-400 hover:border-white transition ${watched ? 'bg-brand-green border-brand-green text-black' : 'text-white'}`}
                    title="İzlendi Olarak İşaretle"
                >
                    <PlayCircle size={16} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};