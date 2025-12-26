import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { SearchPage } from './pages/Search';
import { Library } from './pages/Library';
import { Readme } from './pages/Readme';
import { WatchParty } from './pages/WatchParty';
import { Profile } from './pages/Profile';
import { BattleArena } from './pages/BattleArena';
import { MovieProvider } from './context/AppContext';
import { Movie } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [partyMovie, setPartyMovie] = useState<Movie | null>(null);

  const handleStartParty = (movie: Movie) => {
    setPartyMovie(movie);
    setCurrentPage('watch-party');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onStartParty={handleStartParty} />;
      case 'search':
        return <SearchPage onStartParty={handleStartParty} />;
      case 'arena':
        return <BattleArena />;
      case 'library':
        return <Library onStartParty={handleStartParty} />;
      case 'profile':
        return <Profile />;
      case 'readme':
        return <Readme />;
      case 'watch-party':
        return partyMovie ? (
          <WatchParty 
            movie={partyMovie} 
            onBack={() => setCurrentPage('home')} 
          />
        ) : (
          <Home onStartParty={handleStartParty} />
        );
      default:
        return <Home onStartParty={handleStartParty} />;
    }
  };

  return (
    <MovieProvider>
      <div className="min-h-screen bg-brand-black text-gray-100 font-sans selection:bg-brand-red selection:text-white">
        {/* Only show Navbar if NOT in watch party mode to give full immersion */}
        {currentPage !== 'watch-party' && (
             <Navbar currentPage={currentPage} setPage={setCurrentPage} />
        )}
        
        <main>
          {renderPage()}
        </main>
        
        {currentPage !== 'watch-party' && (
          <footer className="bg-black py-8 mt-12 border-t border-white/10">
              <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
                  <p>&copy; 2024 CineMaster AI. Tüm hakları saklıdır.</p>
                  <p className="mt-2">Google Gemini API tarafından güçlendirilmiştir.</p>
              </div>
          </footer>
        )}
      </div>
    </MovieProvider>
  );
}

export default App;