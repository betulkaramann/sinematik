import React, { useState } from 'react';
import { Search, Swords, Trophy, AlertCircle, Loader2, Crown, Minus } from 'lucide-react';
import { compareMoviesAI, searchMoviesAI } from '../services/geminiService';
import { Movie, BattleResult } from '../types';

export const BattleArena = () => {
  const [leftQuery, setLeftQuery] = useState('');
  const [rightQuery, setRightQuery] = useState('');
  const [leftMovie, setLeftMovie] = useState<Movie | null>(null);
  const [rightMovie, setRightMovie] = useState<Movie | null>(null);
  const [isSearchingLeft, setIsSearchingLeft] = useState(false);
  const [isSearchingRight, setIsSearchingRight] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [isBattling, setIsBattling] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (side: 'left' | 'right', query: string) => {
    if (!query) return;
    side === 'left' ? setIsSearchingLeft(true) : setIsSearchingRight(true);
    
    try {
        const results = await searchMoviesAI({ query, type: 'all' });
        if (results && results.length > 0) {
            side === 'left' ? setLeftMovie(results[0]) : setRightMovie(results[0]);
            setBattleResult(null); // Reset previous battle
            setError('');
        }
    } catch (e) {
        console.error(e);
    } finally {
        side === 'left' ? setIsSearchingLeft(false) : setIsSearchingRight(false);
    }
  };

  const startBattle = async () => {
      if (!leftMovie || !rightMovie) return;
      setIsBattling(true);
      setError('');
      try {
          const result = await compareMoviesAI(leftMovie.title, rightMovie.title);
          setBattleResult(result);
      } catch (e) {
          setError('Savaş başlatılamadı. Yapay zeka şu an meşgul.');
      } finally {
          setIsBattling(false);
      }
  };

  return (
    <div className="min-h-screen pt-4 px-4 md:px-16 pb-20 bg-[url('https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-fixed bg-blend-overlay bg-black/90">
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-in slide-in-from-top duration-700">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 uppercase tracking-tighter italic drop-shadow-2xl">
                Arena
            </h1>
            <p className="text-gray-400 mt-4 text-lg">Hangi film daha iyi? Yapay zeka karar versin.</p>
        </div>

        {/* Fighters Selection */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 relative">
            
            {/* Left Corner */}
            <FighterInput 
                side="left"
                query={leftQuery}
                setQuery={setLeftQuery}
                onSearch={() => handleSearch('left', leftQuery)}
                movie={leftMovie}
                loading={isSearchingLeft}
                color="blue"
            />

            {/* VS Badge */}
            <div className="z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-24 h-24 bg-black rounded-full border-4 border-white/10 shadow-[0_0_50px_rgba(229,9,20,0.5)]">
                <Swords size={48} className="text-white animate-pulse" />
            </div>
            {/* Mobile VS */}
            <div className="md:hidden text-brand-red font-black text-4xl">VS</div>

            {/* Right Corner */}
            <FighterInput 
                side="right"
                query={rightQuery}
                setQuery={setRightQuery}
                onSearch={() => handleSearch('right', rightQuery)}
                movie={rightMovie}
                loading={isSearchingRight}
                color="red"
            />
        </div>

        {/* Action Button */}
        <div className="text-center mb-16">
            <button 
                onClick={startBattle}
                disabled={!leftMovie || !rightMovie || isBattling}
                className={`
                    px-12 py-4 rounded-full font-black text-2xl uppercase tracking-widest transition-all transform
                    ${!leftMovie || !rightMovie 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                        : isBattling 
                            ? 'bg-brand-red text-white scale-95 cursor-wait'
                            : 'bg-gradient-to-r from-brand-red to-orange-600 text-white hover:scale-110 hover:shadow-[0_0_30px_rgba(229,9,20,0.6)] shadow-lg'
                    }
                `}
            >
                {isBattling ? 'Çarpışılıyor...' : 'Savaşı Başlat'}
            </button>
            {error && <div className="mt-4 text-red-500 flex items-center justify-center gap-2"><AlertCircle size={16} /> {error}</div>}
        </div>

        {/* Results Arena */}
        {battleResult && leftMovie && rightMovie && (
            <div className="animate-in zoom-in duration-500 bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Winner Header */}
                <div className={`relative p-8 text-center bg-gradient-to-b ${battleResult.winner === 'left' ? 'from-blue-900/40 via-blue-900/10' : 'from-red-900/40 via-red-900/10'} to-[#111]`}>
                    <div className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 py-2 rounded-full text-sm font-black mb-6 shadow-[0_0_20px_rgba(234,179,8,0.5)] animate-bounce">
                        <Trophy size={18} fill="currentColor" /> KAZANAN
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-xl">
                        {battleResult.winner === 'left' ? leftMovie.title : rightMovie.title}
                    </h2>
                    <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/5">
                        <p className="text-gray-300 italic text-lg leading-relaxed">"{battleResult.summary}"</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="p-4 md:p-8 space-y-4">
                    {battleResult.categories.map((cat, idx) => {
                        const leftWon = cat.winner === 'left';
                        const rightWon = cat.winner === 'right';
                        const isTie = cat.winner === 'tie';

                        return (
                            <div key={idx} className="bg-[#181818] p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                {/* Header Row: Scores */}
                                <div className="flex justify-between items-end mb-3 relative z-10">
                                    {/* Left Score */}
                                    <div className={`flex flex-col items-start w-24 transition-all duration-500 ${leftWon ? 'scale-110' : 'opacity-60'}`}>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-3xl font-black ${leftWon ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'text-gray-600'}`}>
                                                {cat.scoreLeft}
                                            </span>
                                            {leftWon && <Crown size={20} className="text-yellow-500 fill-yellow-500 animate-in zoom-in" />}
                                        </div>
                                    </div>

                                    {/* Category Name */}
                                    <div className="flex-1 text-center px-2">
                                        <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-gray-400 font-bold bg-black/50 px-3 py-1 rounded-full border border-white/5">
                                            {cat.name}
                                        </span>
                                    </div>

                                    {/* Right Score */}
                                    <div className={`flex flex-col items-end w-24 transition-all duration-500 ${rightWon ? 'scale-110' : 'opacity-60'}`}>
                                        <div className="flex items-center gap-2">
                                            {rightWon && <Crown size={20} className="text-yellow-500 fill-yellow-500 animate-in zoom-in" />}
                                            <span className={`text-3xl font-black ${rightWon ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-gray-600'}`}>
                                                {cat.scoreRight}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bars Visualization (Center Out) */}
                                <div className="flex items-center gap-1 h-3 mb-4 relative">
                                    {/* Left Bar */}
                                    <div className="flex-1 flex justify-end bg-gray-900/50 rounded-l-full overflow-hidden h-full">
                                        <div 
                                            className={`h-full transition-all duration-1000 ease-out ${leftWon ? 'bg-gradient-to-l from-blue-500 to-blue-700 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-gray-700'}`}
                                            style={{ width: `${cat.scoreLeft}%` }}
                                        />
                                    </div>

                                    {/* Center Divider */}
                                    <div className="w-1 h-4 bg-gray-500 rounded-full z-10 flex-shrink-0"></div>

                                    {/* Right Bar */}
                                    <div className="flex-1 flex justify-start bg-gray-900/50 rounded-r-full overflow-hidden h-full">
                                        <div 
                                            className={`h-full transition-all duration-1000 ease-out ${rightWon ? 'bg-gradient-to-r from-red-600 to-red-800 shadow-[0_0_15px_rgba(220,38,38,0.6)]' : 'bg-gray-700'}`}
                                            style={{ width: `${cat.scoreRight}%` }}
                                        />
                                    </div>
                                </div>

                                {/* AI Reasoning */}
                                <div className="flex items-start gap-2 justify-center">
                                    <Minus size={16} className="text-gray-600 mt-0.5 hidden md:block" />
                                    <p className="text-sm text-center text-gray-400 font-medium leading-relaxed max-w-2xl">
                                        {cat.reason}
                                    </p>
                                    <Minus size={16} className="text-gray-600 mt-0.5 hidden md:block" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

const FighterInput = ({ side, query, setQuery, onSearch, movie, loading, color }: any) => {
    const isBlue = color === 'blue';
    return (
        <div className={`flex-1 w-full relative group ${isBlue ? 'text-blue-500' : 'text-red-500'}`}>
            {!movie ? (
                <div className={`
                    h-[400px] w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all
                    ${isBlue ? 'border-blue-900/50 bg-blue-900/10 hover:border-blue-500/50' : 'border-red-900/50 bg-red-900/10 hover:border-red-500/50'}
                `}>
                    <div className="w-full max-w-xs relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                            placeholder={isBlue ? "1. Film (Örn: Matrix)" : "2. Film (Örn: Inception)"}
                            className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-current transition text-center"
                        />
                        <button 
                            onClick={onSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                        </button>
                    </div>
                    <p className="mt-4 text-sm text-gray-500 font-medium">Rakibi Seç</p>
                </div>
            ) : (
                <div className="h-[400px] w-full relative rounded-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 shadow-2xl">
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${isBlue ? 'from-blue-900/90' : 'from-red-900/90'} via-transparent to-transparent flex flex-col justify-end p-6`}>
                        <h3 className="text-3xl font-bold text-white leading-none mb-1">{movie.title}</h3>
                        <p className="text-white/70">{movie.year}</p>
                        <button 
                            onClick={() => setQuery('')} // Reset logic handling needed in parent ideally, but simple reload works for demo
                            className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-white hover:text-black transition"
                            onClickCapture={() => window.location.reload()} // Quick reset for demo
                        >
                            <Loader2 size={16} className="opacity-0" /> {/* Hacky visual */}
                             <span className="text-xs font-bold">DEĞİŞTİR</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
