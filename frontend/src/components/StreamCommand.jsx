import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Activity, CreditCard, FileText, Truck } from 'lucide-react';

const streamConfig = {
  upi: { label: 'UPI', icon: Activity, color: 'emerald' },
  pos: { label: 'POS', icon: CreditCard, color: 'blue' },
  gst: { label: 'GST', icon: FileText, color: 'amber' },
  eway: { label: 'E-WAY', icon: Truck, color: 'purple' }
};

const StreamCommand = () => {
  const { streamStatus, toggleStream, isConnected } = useDashboard();

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">
        Stream Control
      </span>
      
      {Object.entries(streamConfig).map(([key, config]) => {
        const Icon = config.icon;
        const isActive = streamStatus[key];
        const isDisabled = !isConnected;
        
        return (
          <button
            key={key}
            onClick={() => toggleStream(key)}
            disabled={isDisabled}
            className={`
              relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-semibold
              transition-all duration-200 border backdrop-blur-sm
              ${isActive 
                ? `bg-${config.color}-500/20 border-${config.color}-500/40 text-${config.color}-400 shadow-sm shadow-${config.color}-500/20` 
                : 'bg-slate-800/50 border-slate-700 text-slate-500'
              }
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 cursor-pointer'}
            `}
          >
            <Icon size={12} className={isActive ? `text-${config.color}-400` : 'text-slate-500'} />
            <span>{config.label}</span>
            
            {/* Status dot */}
            <span 
              className={`
                w-1.5 h-1.5 rounded-full ml-0.5
                ${isActive 
                  ? `bg-${config.color}-400 animate-pulse` 
                  : 'bg-slate-600'
                }
              `}
            />
          </button>
        );
      })}
      
      {/* Connection indicator */}
      <div className={`
        ml-2 w-2 h-2 rounded-full 
        ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}
      `} />
    </div>
  );
};

export default StreamCommand;
