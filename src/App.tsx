import React, { useState, useEffect } from 'react';
import { Search, User as UserIcon, Heart, Menu, X, Gamepad2, Star, TrendingUp, Calendar, Info, Play, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Game, User, Review } from './types';

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Components ---

const Navbar = ({ user, onLogout, onAuthClick }: { user: User | null, onLogout: () => void, onAuthClick: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="w-10 h-10 bg-linear-to-br from-gaming-accent to-gaming-neon rounded-lg flex items-center justify-center neon-glow">
            <Gamepad2 className="text-gaming-black" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">Nexus</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-widest text-white/70">
          <a href="/" className="hover:text-gaming-accent transition-colors">Home</a>
          <a href="/games" className="hover:text-gaming-accent transition-colors">Store</a>
          <a href="/news" className="hover:text-gaming-accent transition-colors">News</a>
          <a href="/about" className="hover:text-gaming-accent transition-colors">About</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:text-gaming-accent transition-colors">
            <Search size={20} />
          </button>
          {user ? (
            <div className="flex items-center gap-4">
              <button className="p-2 hover:text-gaming-accent transition-colors">
                <Heart size={20} />
              </button>
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
                <div className="w-6 h-6 bg-gaming-accent rounded-full flex items-center justify-center text-[10px] font-bold text-gaming-black">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="text-xs font-bold">{user.username}</span>
                <button onClick={onLogout} className="text-[10px] uppercase tracking-tighter opacity-50 hover:opacity-100">Logout</button>
              </div>
            </div>
          ) : (
            <button 
              onClick={onAuthClick}
              className="px-6 py-2 bg-white text-gaming-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-gaming-accent transition-all active:scale-95"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

interface GameCardProps {
  game: Game;
  onClick: () => void;
  key?: React.Key;
}

const GameCard = ({ game, onClick }: GameCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group relative bg-gaming-dark rounded-2xl overflow-hidden neon-border cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-3/4 overflow-hidden">
        <img 
          src={game.thumbnail_url} 
          alt={game.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-gaming-black via-transparent to-transparent opacity-90" />
      
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-gaming-accent/20 text-gaming-accent text-[10px] font-bold uppercase rounded border border-gaming-accent/30">
            {game.genre.split(',')[0]}
          </span>
          <div className="flex items-center gap-1 text-yellow-400 text-[10px] font-bold">
            <Star size={10} fill="currentColor" />
            {game.rating}
          </div>
        </div>
        <h3 className="text-lg font-bold leading-tight group-hover:text-gaming-accent transition-colors">{game.title}</h3>
        <p className="text-xs text-white/50 mt-1 line-clamp-1">{game.platform}</p>
      </div>
    </motion.div>
  );
};

const Hero = ({ featuredGame, onExplore }: { featuredGame: Game | null, onExplore: (game: Game) => void }) => {
  if (!featuredGame) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={featuredGame.banner_url} 
          alt={featuredGame.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-r from-gaming-black via-gaming-black/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-gaming-black via-transparent to-transparent" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-gaming-accent text-gaming-black text-xs font-black uppercase tracking-widest rounded">Featured</span>
            <span className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
              <Calendar size={14} /> {new Date(featuredGame.release_date).getFullYear()}
            </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.85] mb-6">
            {featuredGame.title.split(' ').map((word, i) => (
              <span key={i} className={i % 2 === 1 ? 'text-gradient' : ''}>{word} </span>
            ))}
          </h1>
          <p className="text-lg text-white/70 mb-8 line-clamp-3 font-medium leading-relaxed">
            {featuredGame.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onExplore(featuredGame)}
              className="px-8 py-4 bg-gaming-accent text-gaming-black font-black uppercase tracking-widest rounded-full flex items-center gap-2 hover:scale-105 transition-transform neon-glow"
            >
              <Play size={20} fill="currentColor" /> Play Trailer
            </button>
            <button 
              onClick={() => onExplore(featuredGame)}
              className="px-8 py-4 glass text-white font-black uppercase tracking-widest rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              <Info size={20} /> Details
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 right-12 hidden lg:flex items-center gap-8">
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1">Developer</p>
          <p className="text-sm font-black uppercase italic">{featuredGame.developer}</p>
        </div>
        <div className="w-px h-12 bg-white/10" />
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1">Rating</p>
          <p className="text-sm font-black uppercase italic text-gaming-accent">{featuredGame.rating} / 5.0</p>
        </div>
      </div>
    </section>
  );
};

const AuthModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: (user: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      onLogin(data);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gaming-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md glass p-8 rounded-3xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:text-gaming-accent">
              <X size={20} />
            </button>
            <h2 className="text-3xl font-black uppercase italic mb-2">Welcome Back</h2>
            <p className="text-white/50 text-sm mb-8">Enter your credentials to access your gaming vault.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gaming-accent outline-hidden transition-colors"
                  placeholder="commander@nexus.com"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gaming-accent outline-hidden transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gaming-accent text-gaming-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all neon-glow disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Access Vault'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const GameDetailsModal = ({ game, isOpen, onClose }: { game: Game | null, isOpen: boolean, onClose: () => void }) => {
  if (!game) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gaming-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-6xl bg-gaming-black min-h-screen md:min-h-0 md:rounded-3xl overflow-hidden shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 glass rounded-full hover:text-gaming-accent">
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-video lg:aspect-auto h-full">
                <iframe 
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${game.trailer_id}?autoplay=1&mute=1`}
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-8 md:p-12 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-gaming-accent/20 text-gaming-accent text-xs font-black uppercase tracking-widest rounded border border-gaming-accent/30">
                    {game.genre}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400 font-bold">
                    <Star size={16} fill="currentColor" /> {game.rating}
                  </div>
                </div>

                <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none mb-6">{game.title}</h2>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Developer</p>
                    <p className="text-sm font-bold">{game.developer}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Release Date</p>
                    <p className="text-sm font-bold">{new Date(game.release_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <p className="text-white/70 leading-relaxed mb-8">{game.description}</p>

                <div className="space-y-6">
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gaming-accent">System Requirements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass p-4 rounded-xl">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">Minimum</p>
                      <p className="text-xs leading-relaxed text-white/80">{game.min_requirements}</p>
                    </div>
                    <div className="glass p-4 rounded-xl">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2">Recommended</p>
                      <p className="text-xs leading-relaxed text-white/80">{game.rec_requirements}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <button className="flex-1 py-4 bg-gaming-accent text-gaming-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-transform neon-glow">
                    Add to Wishlist
                  </button>
                  <button className="px-6 py-4 glass text-white font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);

  const getSmartRecommendation = async () => {
    setIsRecommending(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on these games: ${games.map(g => g.title).join(', ')}, suggest one more AAA game that fits this collection and explain why in 2 sentences. Keep it cool and gaming-focused.`,
      });
      setRecommendation(response.text || "Could not generate recommendation.");
    } catch (err) {
      console.error(err);
      setRecommendation("The AI is currently offline. Try again later.");
    } finally {
      setIsRecommending(false);
    }
  };

  useEffect(() => {
    fetchGames();
    // Check local storage for user
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, [filter, search]);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/games?genre=${filter}&search=${search}`);
      const data = await res.json();
      setGames(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('nexus_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
  };

  const genres = ['All', 'Action', 'RPG', 'Adventure', 'Souls-like'];

  return (
    <div className="min-h-screen bg-gaming-black selection:bg-gaming-accent selection:text-gaming-black">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onAuthClick={() => setIsAuthModalOpen(true)} 
      />

      <main>
        {/* Hero Section */}
        <Hero 
          featuredGame={games.length > 0 ? games[0] : null} 
          onExplore={(game) => setSelectedGame(game)} 
        />

        {/* Store Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          {/* AI Recommendation Banner */}
          <div className="mb-16 glass p-8 rounded-3xl border-gaming-accent/20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-gaming-neon font-black uppercase tracking-widest text-xs mb-2">
                  <Star size={14} fill="currentColor" /> AI Powered Insights
                </div>
                <h3 className="text-2xl font-black uppercase italic mb-4">Nexus <span className="text-gaming-accent">Oracle</span></h3>
                <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
                  {recommendation || "Let our AI analyze the current vault and suggest your next masterpiece."}
                </p>
              </div>
              <button 
                onClick={getSmartRecommendation}
                disabled={isRecommending}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-xl hover:bg-gaming-accent hover:text-gaming-black transition-all disabled:opacity-50"
              >
                {isRecommending ? "Analyzing..." : "Get Suggestion"}
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gaming-accent/5 blur-3xl rounded-full -mr-32 -mt-32" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <div className="flex items-center gap-2 text-gaming-accent font-black uppercase tracking-[0.3em] text-xs mb-4">
                <TrendingUp size={16} /> Trending Now
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                Discovery <span className="text-gradient">Vault</span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="text" 
                  placeholder="Search titles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-sm focus:border-gaming-accent outline-hidden transition-colors w-64"
                />
              </div>
              <div className="flex items-center gap-2 glass p-1 rounded-full">
                {genres.map(g => (
                  <button
                    key={g}
                    onClick={() => setFilter(g)}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === g ? 'bg-gaming-accent text-gaming-black' : 'hover:bg-white/5 text-white/50'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-3/4 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {games.map(game => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onClick={() => setSelectedGame(game)} 
                />
              ))}
            </div>
          )}

          {!loading && games.length === 0 && (
            <div className="text-center py-24 glass rounded-3xl">
              <Gamepad2 size={48} className="mx-auto text-white/10 mb-4" />
              <p className="text-white/40 font-bold uppercase tracking-widest">No games found in the vault.</p>
            </div>
          )}
        </section>

        {/* Trending Section */}
        <section className="bg-gaming-dark/50 py-24 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                Most <span className="text-gaming-neon">Anticipated</span>
              </h2>
              <button className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-gaming-accent transition-colors">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {games.slice(0, 3).map((game, i) => (
                <div key={game.id} className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer" onClick={() => setSelectedGame(game)}>
                  <img src={game.banner_url} alt={game.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-linear-to-t from-gaming-black via-gaming-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gaming-accent mb-2">#0{i+1} Trending</p>
                    <h3 className="text-2xl font-black uppercase italic">{game.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories / Bento Grid */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 glass p-10 rounded-3xl relative overflow-hidden group cursor-pointer">
              <div className="relative z-10">
                <h3 className="text-4xl font-black uppercase italic mb-4">New <span className="text-gaming-accent">Releases</span></h3>
                <p className="text-white/50 text-sm mb-8 max-w-xs">Explore the latest AAA titles fresh from the developers.</p>
                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-gaming-accent transition-colors">
                  Browse All <ChevronRight size={16} />
                </button>
              </div>
              <TrendingUp className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64 group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="glass p-10 rounded-3xl relative overflow-hidden group cursor-pointer">
              <h3 className="text-2xl font-black uppercase italic mb-4">Top Rated</h3>
              <Star className="absolute -bottom-6 -right-6 text-yellow-400/10 w-32 h-32 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="glass p-10 rounded-3xl relative overflow-hidden group cursor-pointer">
              <h3 className="text-2xl font-black uppercase italic mb-4">Coming Soon</h3>
              <Calendar className="absolute -bottom-6 -right-6 text-gaming-neon/10 w-32 h-32 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gaming-dark border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-gaming-accent rounded-lg flex items-center justify-center">
                  <Gamepad2 className="text-gaming-black" size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic">Nexus</span>
              </div>
              <p className="text-white/40 max-w-md leading-relaxed">
                The ultimate discovery platform for AAA gaming. Explore, review, and track your favorite titles in a premium immersive environment.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-8">Platform</h4>
              <ul className="space-y-4 text-sm font-bold text-white/60">
                <li><a href="#" className="hover:text-gaming-accent transition-colors">Store</a></li>
                <li><a href="#" className="hover:text-gaming-accent transition-colors">News</a></li>
                <li><a href="#" className="hover:text-gaming-accent transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-gaming-accent transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-8">Legal</h4>
              <ul className="space-y-4 text-sm font-bold text-white/60">
                <li><a href="#" className="hover:text-gaming-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gaming-accent transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gaming-accent transition-colors">Cookie Settings</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">© 2026 Nexus Gaming Platform. All Rights Reserved.</p>
            <div className="flex items-center gap-6">
              <div className="w-8 h-8 rounded-full glass flex items-center justify-center hover:text-gaming-accent cursor-pointer transition-colors">
                <span className="text-[10px] font-black">TW</span>
              </div>
              <div className="w-8 h-8 rounded-full glass flex items-center justify-center hover:text-gaming-accent cursor-pointer transition-colors">
                <span className="text-[10px] font-black">DC</span>
              </div>
              <div className="w-8 h-8 rounded-full glass flex items-center justify-center hover:text-gaming-accent cursor-pointer transition-colors">
                <span className="text-[10px] font-black">IG</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin} 
      />

      <GameDetailsModal 
        game={selectedGame} 
        isOpen={!!selectedGame} 
        onClose={() => setSelectedGame(null)} 
      />
    </div>
  );
}
