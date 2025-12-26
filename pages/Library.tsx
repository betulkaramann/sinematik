import React, { useState } from 'react';
import { useMovies } from '../context/AppContext';
import { MovieCard } from '../components/MovieCard';
import { MovieDetails } from '../components/MovieDetails';
import { Movie } from '../types';
import { Eye, Clock } from 'lucide-react';

interface LibraryProps {
    onStartParty: (movie: Movie) => void;
}

export const Library: React.FC<LibraryProps> = ({ onStartParty }) => {
  const { watchlist, watched } = useMovies();
  const [activeTab, setActiveTab] = useState<'watchlist' | 'watched'>('watchlist');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const moviesToShow = activeTab === 'watchlist' ? watchlist : watched;

  return (
    <div className="min-h-screen pt-8 px-4 md:px-16 pb-20">
        <h1 className="text-3xl font-bold text-white mb-8">Kütüphanem</h1>
        
        {/* Tabs */}
        <div className="flex gap-4 border-b border-white/10 mb-8">
            <button 
                onClick={() => setActiveTab('watchlist')}
                className={`pb-4 flex items-center gap-2 px-4 font-medium transition-all relative ${activeTab === 'watchlist' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
                <Clock size={18} />
                İzleme Listesi
                <span className="bg-[#333] text-xs px-2 py-0.5 rounded-full text-gray-300">{watchlist.length}</span>
                {activeTab === 'watchlist' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-red rounded-t-full"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('watched')}
                className={`pb-4 flex items-center gap-2 px-4 font-medium transition-all relative ${activeTab === 'watched' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
                <Eye size={18} />
                İzlenenler
                <span className="bg-[#333] text-xs px-2 py-0.5 rounded-full text-gray-300">{watched.length}</span>
                {activeTab === 'watched' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-green rounded-t-full"></div>}
            </button>
        </div>

        {/* Content */}
        {moviesToShow.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-in fade-in duration-300">
                {moviesToShow.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onSelect={setSelectedMovie} />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-[#181818] rounded-xl border border-white/5">
                <div className="bg-[#222] p-6 rounded-full mb-4">
                    {activeTab === 'watchlist' ? <Clock size={48} className="opacity-50" /> : <Eye size={48} className="opacity-50" />}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                    {activeTab === 'watchlist' ? 'Listeniz boş' : 'Henüz bir şey izlemediniz'}
                </h3>
                <p>Filmleri eklemek için "+" butonunu, izlediklerinizi işaretlemek için "Oynat" ikonunu kullanın.</p>
            </div>
        )}

        {selectedMovie && (
            <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} onStartParty={onStartParty} />
        )}
    </div>
  );
};