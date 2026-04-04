import React from 'react';
import { AlertCircle, Zap, ShieldAlert } from 'lucide-react';

const Alerts = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-100 rounded-2xl h-[120px]">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
          Scanning Live Streams...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
        Operational Alerts // Signal Feed
      </h3>
      
      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
        {alerts.map((alert, index) => (
          <div 
            key={index}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 animate-in fade-in slide-in-from-left-2 ${
              alert.includes('Warning') 
                ? 'bg-red-50 border-red-100 text-red-700' 
                : 'bg-indigo-50/50 border-indigo-100 text-royal'
            }`}
          >
            <div className="mt-0.5">
              {alert.includes('Warning') ? <ShieldAlert size={16} /> : <Zap size={16} />}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-tight">
                {alert.includes('Warning') ? 'Critical Signal' : 'System Insight'}
              </span>
              <p className="text-sm font-medium mt-1 leading-relaxed">
                {alert}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
