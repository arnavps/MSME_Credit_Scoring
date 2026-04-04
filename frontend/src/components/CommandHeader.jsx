import React, { useState } from 'react';
import { Search, Zap, Loader2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

function CommandHeader() {
  const [input, setInput] = useState('');
  const { fetchScoreData, loading } = useDashboard();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      fetchScoreData(input.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl relative">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4338CA] transition-colors">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="Enter MSME GSTIN for Deep Intelligence..."
          className="w-full pl-14 pr-32 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-[#4338CA]/5 focus:border-[#4338CA] transition-all font-bold text-slate-700 text-sm tracking-widest placeholder:text-slate-300 placeholder:font-medium shadow-sm"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-connection" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Node Connected</span>
            </div>
            <kbd className="hidden md:block px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-[9px] font-bold text-slate-400 uppercase leading-none">⌘ K</kbd>
        </div>
      </form>
    </div>
  );
}

export default CommandHeader;
