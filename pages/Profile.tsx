import React, { useEffect, useState } from 'react';
import { useMovies } from '../context/AppContext';
import { getUserPersona } from '../services/geminiService';
import { User, Trophy, Clock, Film, BarChart3, Sparkles } from 'lucide-react';

export const Profile = () => {
  const { watched, watchlist } = useMovies();
  const [persona, setPersona] = useState<{ title: string, description: string } | null>(null);
  const [loadingPersona, setLoadingPersona] = useState(false);

  // Stats Calculations
  const totalWatched = watched.length;
  const totalWatchlist = watchlist.length;

  // Calculate approximate minutes (Assuming 2h for movies if parsing fails, just for demo fun)
  const totalMinutes = watched.reduce((acc, movie) => {
    let mins = 0;
    if (movie.duration) {
      if (movie.duration.includes('h')) {
        const parts = movie.duration.split('h');
        mins += parseInt(parts[0]) * 60;
        if (parts[1] && parts[1].includes('m')) {
          mins += parseInt(parts[1]);
        }
      } else if (movie.duration.includes('Season')) {
        mins += parseInt(movie.duration) * 400; // Rough estimate per season
      }
    } else {
        mins = 120; // Default
    }
    return acc + mins;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);

  // Favorite Genre Logic
  const genreCounts: Record<string, number> = {};
  watched.forEach(m => {
    m.genre.forEach(g => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });
  
  const sortedGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3); // Top 3

  useEffect(() => {
    if (watched.length > 0) {
        setLoadingPersona(true);
        getUserPersona(watched)
            .then(setPersona)
            .finally(() => setLoadingPersona(false));
    }
  }, [watched.length]); // Only re-run if list length changes

  return (
    <div className="min-h-screen pt-8 px-4 md:px-16 pb-20">
        
        {/* Header / Profile Card */}
        <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-white/10 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-red to-purple-600 p-1">
                         <div className="w-full h-full rounded-full bg-[#141414] flex items-center justify-center">
                            <User size={64} className="text-gray-300" />
                         </div>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-brand-green text-black font-bold text-xs px-2 py-1 rounded-full border border-white">
                        Level {Math.floor(totalWatched / 5) + 1}
                    </div>
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-3">
                    <h1 className="text-3xl font-bold text-white">Misafir Kullanıcı</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-gray-300 flex items-center gap-2">
                            <Film size={14} /> {totalWatched} Film İzledi
                        </span>
                        <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-gray-300 flex items-center gap-2">
                            <Clock size={14} /> {hours} Saat Ekran Süresi
                        </span>
                    </div>

                    {/* AI Persona Section */}
                    <div className="mt-4 bg-brand-black/50 p-4 rounded-lg border-l-4 border-purple-500 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-1 uppercase tracking-wider">
                                <Sparkles size={16} /> AI Sinema Kimliği
                            </div>
                            {loadingPersona ? (
                                <div className="text-gray-400 text-sm animate-pulse">Analiz ediliyor...</div>
                            ) : persona ? (
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{persona.title}</h3>
                                    <p className="text-gray-400 text-sm italic">"{persona.description}"</p>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">Kimliğini oluşturmak için birkaç film izle.</p>
                            )}
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute -right-4 -top-4 text-purple-900/20 rotate-12">
                            <Sparkles size={100} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Top Genres */}
                <div className="bg-[#181818] p-6 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-6 text-gray-300 font-semibold">
                        <BarChart3 size={20} className="text-brand-red" />
                        Favori Türlerin
                    </div>
                    <div className="space-y-4">
                        {sortedGenres.length > 0 ? sortedGenres.map(([genre, count], index) => {
                            const percent = Math.round((count / totalWatched) * 100);
                            return (
                                <div key={genre}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-white font-medium">{genre}</span>
                                        <span className="text-gray-500">{count} Film (%{percent})</span>
                                    </div>
                                    <div className="w-full bg-[#333] rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${index === 0 ? 'bg-brand-red' : 'bg-gray-600'}`} 
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className="text-center text-gray-600 py-4">Veri yok</div>
                        )}
                    </div>
                </div>

                {/* Achievements */}
                <div className="bg-[#181818] p-6 rounded-xl border border-white/5 md:col-span-2">
                    <div className="flex items-center gap-2 mb-6 text-gray-300 font-semibold">
                        <Trophy size={20} className="text-yellow-500" />
                        Rozetlerin
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <AchievementCard 
                            title="Yeni Başlayan" 
                            desc="İlk filmini izle" 
                            unlocked={totalWatched >= 1} 
                            icon="🎬" 
                        />
                        <AchievementCard 
                            title="Film Kurdu" 
                            desc="5 film izle" 
                            unlocked={totalWatched >= 5} 
                            icon="🍿" 
                        />
                         <AchievementCard 
                            title="Maratoncu" 
                            desc="10 saatten fazla izle" 
                            unlocked={hours >= 10} 
                            icon="⏱️" 
                        />
                         <AchievementCard 
                            title="Koleksiyoner" 
                            desc="Listene 5 film ekle" 
                            unlocked={totalWatchlist >= 5} 
                            icon="📚" 
                        />
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

const AchievementCard = ({ title, desc, unlocked, icon }: { title: string, desc: string, unlocked: boolean, icon: string }) => (
    <div className={`p-4 rounded-lg border flex flex-col items-center text-center transition-all ${unlocked ? 'bg-white/5 border-yellow-500/30 shadow-lg shadow-yellow-900/10' : 'bg-[#111] border-white/5 opacity-50 grayscale'}`}>
        <div className="text-3xl mb-2">{icon}</div>
        <h4 className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-gray-500'}`}>{title}</h4>
        <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </div>
);