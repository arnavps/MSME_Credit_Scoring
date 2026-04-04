import React from 'react';
import { Activity, Bell, UserCircle } from 'lucide-react';

const Header = ({ syncStatus }) => {
  const isHealthy = syncStatus === 'online';
  
  return (
    <header className="flex items-center justify-between px-8 py-6 mb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Good morning, <span className="text-primary italic">Insignia Team</span>
        </h1>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-status-low animate-pulse' : 'bg-status-moderate'}`} />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
            {isHealthy ? 'Live Sync Active' : 'Connecting...'}
          </span>
          <span className="text-xs text-slate-300 ml-2">Last Heartbeat: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
          <Bell size={24} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-status-critical rounded-full border-2 border-white" />
        </button>
        <div className="h-8 w-[1px] bg-slate-200" />
        <div className="flex items-center gap-3 bg-white/50 px-4 py-2 rounded-full border border-white/40 shadow-sm cursor-pointer hover:bg-white transition-all">
          <UserCircle size={32} className="text-primary" />
          <span className="font-semibold text-sm text-slate-700">Arnav S.</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
