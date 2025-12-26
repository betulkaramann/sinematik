import React, { useState, useEffect, useRef } from 'react';
import { Movie } from '../types';
import { Send, Users, MessageSquare, Play, Pause, ArrowLeft } from 'lucide-react';

interface WatchPartyProps {
  movie: Movie;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  isSystem?: boolean;
  color?: string;
}

const MOCK_USERS = [
  { name: 'Ahmet', color: 'text-blue-400' },
  { name: 'Zeynep', color: 'text-pink-400' },
  { name: 'Can', color: 'text-green-400' },
  { name: 'Elif', color: 'text-yellow-400' },
];

const RANDOM_COMMENTS = [
  "Bu sahne efsane!",
  "Müzikler çok iyi değil mi?",
  "Oha beklemiyordum...",
  "Yönetmen döktürmüş.",
  "Burayı hatırlıyorum!",
  "Hadi canım sende!",
  "Görüntü yönetmeni Oscar alır."
];

export const WatchParty: React.FC<WatchPartyProps> = ({ movie, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'System', text: `"${movie.title}" izleme partisi oluşturuldu.`, isSystem: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [viewers, setViewers] = useState(1);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate incoming users and messages
  useEffect(() => {
    const intervals: any[] = [];

    // Simulate users joining
    intervals.push(setInterval(() => {
      if (viewers < 15) {
        setViewers(prev => prev + 1);
        const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            user: 'System', 
            text: `${randomUser.name} partiye katıldı.`, 
            isSystem: true 
        }]);
      }
    }, 5000));

    // Simulate chat messages
    intervals.push(setInterval(() => {
      if (Math.random() > 0.6) {
        const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        const randomComment = RANDOM_COMMENTS[Math.floor(Math.random() * RANDOM_COMMENTS.length)];
        setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            user: randomUser.name, 
            text: randomComment, 
            color: randomUser.color 
        }]);
      }
    }, 8000));

    return () => intervals.forEach(clearInterval);
  }, [viewers]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      user: 'Sen',
      text: inputText,
      color: 'text-white'
    }]);
    setInputText('');
  };

  // Construct a YouTube search URL for the embed to simulate the movie
  const videoSrc = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(movie.title + " trailer")}&autoplay=1&mute=0&controls=1`;

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <div className="h-16 bg-[#181818] border-b border-white/10 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-white font-bold text-lg">{movie.title}</h2>
            <div className="flex items-center gap-2 text-xs text-green-500">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               Canlı Senkronizasyon
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm text-white">
            <Users size={16} />
            <span>{viewers} İzleyici</span>
          </div>
          <button className="bg-brand-red px-4 py-2 rounded font-bold text-white text-sm hover:bg-red-700 transition">
            Linki Paylaş
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Video Area */}
        <div className="flex-1 bg-black relative flex items-center justify-center">
          <iframe 
            src={videoSrc} 
            className="w-full h-full absolute inset-0"
            title={movie.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Chat Sidebar */}
        <div className="w-full lg:w-96 bg-[#111] border-l border-white/10 flex flex-col h-[40vh] lg:h-auto">
          <div className="p-4 border-b border-white/10 flex items-center gap-2 text-white font-medium">
            <MessageSquare size={18} />
            Party Chat
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.user === 'Sen' ? 'items-end' : 'items-start'}`}>
                {!msg.isSystem && (
                    <span className={`text-xs font-bold mb-1 ${msg.color || 'text-gray-400'}`}>{msg.user}</span>
                )}
                <div className={`
                  px-3 py-2 rounded-lg text-sm max-w-[85%]
                  ${msg.isSystem ? 'bg-white/5 text-gray-400 text-xs italic w-full text-center' : ''}
                  ${!msg.isSystem && msg.user === 'Sen' ? 'bg-brand-red text-white rounded-tr-none' : ''}
                  ${!msg.isSystem && msg.user !== 'Sen' ? 'bg-gray-800 text-gray-200 rounded-tl-none' : ''}
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-[#181818] border-t border-white/10">
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Bir mesaj yaz..."
                className="w-full bg-[#2a2a2a] text-white rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-brand-red text-sm"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-brand-red text-white rounded-full hover:bg-red-700 transition"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};