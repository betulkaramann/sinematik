import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { searchMoviesAI } from '../services/geminiService';
import { Movie, SearchFilters } from '../types';
import { MovieCard } from '../components/MovieCard';
import { MovieDetails } from '../components/MovieDetails';

interface SearchPageProps {
  onStartParty: (movie: Movie) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onStartParty }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    minRating: 0,
    yearFrom: 1980,
    yearTo: 2025
  });
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filters.query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    const movies = await searchMoviesAI(filters);
    setResults(movies);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pt-4 px-4 md:px-16 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Search Header */}
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-white">Keşfet & Bul</h1>
            
            <form onSubmit={handleSearch} className="relative w-full">
                <input
                    type="text"
                    placeholder="Film, dizi, oyuncu, yönetmen veya '1990'ların en iyi aksiyon filmleri' gibi bir şey yazın..."
                    className="w-full bg-[#222] border border-[#333] text-white text-lg p-6 pl-14 rounded-xl focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition shadow-lg"
                    value={filters.query}
                    onChange={(e) => setFilters({...filters, query: e.target.value})}
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                <button 
                    type="submit" 
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-brand-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Ara'}
                </button>
            </form>

            {/* Filters Bar */}
            <div className="flex flex-wrap gap-4 items-center bg-[#181818] p-4 rounded-lg border border-white/5">
                <div className="flex items-center gap-2 text-gray-400 mr-4">
                    <SlidersHorizontal size={18} />
                    <span className="text-sm font-semibold uppercase">Filtreler</span>
                </div>
                
                <select 
                    className="bg-[#333] text-gray-200 p-2 rounded text-sm border-none focus:ring-1 focus:ring-brand-red"
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value as any})}
                >
                    <option value="all">Tüm Tipler</option>
                    <option value="movie">Sadece Filmler</option>
                    <option value="series">Sadece Diziler</option>
                </select>

                <select 
                    className="bg-[#333] text-gray-200 p-2 rounded text-sm border-none focus:ring-1 focus:ring-brand-red"
                    value={filters.genre}
                    onChange={(e) => setFilters({...filters, genre: e.target.value})}
                >
                    <option value="">Tüm Türler</option>
                    <option value="Action">Aksiyon</option>
                    <option value="Drama">Drama</option>
                    <option value="Comedy">Komedi</option>
                    <option value="Sci-Fi">Bilim Kurgu</option>
                    <option value="Horror">Korku</option>
                    <option value="Romance">Romantik</option>
                </select>

                <div className="flex items-center gap-2 bg-[#333] px-3 py-2 rounded">
                    <span className="text-xs text-gray-400">Min Puan:</span>
                    <input 
                        type="number" 
                        min="0" 
                        max="10" 
                        step="0.1"
                        value={filters.minRating}
                        onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
                        className="bg-transparent w-12 text-center text-white text-sm focus:outline-none"
                    />
                </div>
            </div>
        </div>

        {/* Results */}
        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 size={48} className="animate-spin mb-4 text-brand-red" />
                <p>Yapay Zeka veritabanını tarıyor...</p>
            </div>
        ) : results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {results.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onSelect={setSelectedMovie} />
                ))}
            </div>
        ) : hasSearched ? (
            <div className="text-center py-20 text-gray-500">
                <p className="text-xl">Sonuç bulunamadı.</p>
                <p className="text-sm mt-2">Daha genel bir arama yapmayı deneyin.</p>
            </div>
        ) : (
             <div className="text-center py-20 text-gray-600">
                <Filter size={64} className="mx-auto mb-4 opacity-20" />
                <p>Arama yapmak için yukarıdaki çubuğu kullanın.</p>
                <p className="text-sm mt-2">Örnek: "Christopher Nolan filmleri", "90lar korku", "IMDB 8+ komedi"</p>
            </div>
        )}

        {selectedMovie && (
            <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} onStartParty={onStartParty} />
        )}
      </div>
    </div>
  );
};