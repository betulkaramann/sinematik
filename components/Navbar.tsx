import React, { useState } from 'react';
import { Layout, Search, BookOpen, Film, Menu, X, User, Swords } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setPage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Ana Sayfa', icon: <Film size={18} /> },
    { id: 'search', label: 'Keşfet & Ara', icon: <Search size={18} /> },
    { id: 'arena', label: 'Arena', icon: <Swords size={18} /> },
    { id: 'library', label: 'Kütüphanem', icon: <Layout size={18} /> },
    { id: 'profile', label: 'Profil & İstatistik', icon: <User size={18} /> },
    { id: 'readme', label: 'Proje Hakkında', icon: <BookOpen size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={() => setPage('home')}>
            <div className="w-8 h-8 bg-brand-red rounded-md flex items-center justify-center font-bold text-white">C</div>
            <span className="text-xl font-bold tracking-wider text-brand-red">CINEMASTER</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'text-white bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Profile / Mobile Toggle */}
          <div className="flex items-center gap-4">
             {/* Profile Icon Button - Clicking goes to Profile */}
            <div 
                className={`hidden md:flex items-center gap-2 cursor-pointer transition-all ${currentPage === 'profile' ? 'scale-110 ring-2 ring-white rounded-full' : 'opacity-80 hover:opacity-100'}`}
                onClick={() => setPage('profile')}
            >
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                 <User size={16} className="text-white" />
               </div>
            </div>
            
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-dark border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPage(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-md text-base font-medium ${
                  currentPage === item.id
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};