
import React from 'react';
import { Bell, Search, Menu, User } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  isSessionActive: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isSessionActive }) => {
  return (
    <header className="h-20 border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-30 px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar - Hidden on small screens */}
        <div className="hidden md:flex items-center bg-white/5 border border-white/5 rounded-xl px-4 py-2 w-96 focus-within:border-indigo-500/50 transition-all duration-200 group">
          <Search size={18} className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search resources, roadmaps..." 
            className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-full placeholder:text-slate-500 text-slate-200"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* Session Status */}
        <div className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${
          isSessionActive 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-slate-500/10 border-slate-500/20 text-slate-500'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isSessionActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-500'}`} />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {isSessionActive ? 'Live Session Active' : 'System Idle'}
          </span>
        </div>

        <button className="relative p-2 text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-xl transition-colors group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950 group-hover:scale-125 transition-transform" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-slate-300 hover:border-indigo-500/50 cursor-pointer transition-all duration-200 overflow-hidden">
          <User size={20} />
        </div>
      </div>
    </header>
  );
};

export default Header;
