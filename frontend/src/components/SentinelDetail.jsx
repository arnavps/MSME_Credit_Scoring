import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  Activity,
  ChevronRight,
  X,
  Signal,
  Sparkles
} from 'lucide-react';
import Alerts from './Alerts';
import AmnestyBadge from './AmnestyBadge';
import AmnestyForensicPanel from './AmnestyForensicPanel';
import AmnestyForensicTraceCard from './AmnestyForensicTraceCard';

// 17 Sentinel Signals with metadata
const sentinelSignals = [
  { id: 'S01', name: 'Utility Payment Drop', severity: 'MEDIUM', leadTime: 45, type: 'Host', description: 'Sudden drop in utility payments indicating operational slowdown' },
  { id: 'S02', name: 'GST Login Dormancy', severity: 'MEDIUM', leadTime: 30, type: 'Host', description: 'Cessation of GST portal logins' },
  { id: 'S03', name: 'Frequent Address Changes', severity: 'LOW', leadTime: 90, type: 'Host', description: 'Multiple business address changes in short period' },
  { id: 'S04', name: 'Wage Payment Delays', severity: 'HIGH', leadTime: 15, type: 'Host', description: 'Labor turnover spike or wage settlement delays' },
  { id: 'S05', name: 'Cheque/NACH Bounce', severity: 'CRITICAL', leadTime: 5, type: 'Transaction', description: 'Onset of cheque or NACH bounce events' },
  { id: 'S06', name: 'Round-tripping Surge', severity: 'CRITICAL', leadTime: 0, type: 'Transaction', description: 'Significant increase in round-tripping volume' },
  { id: 'S07', name: 'Buyer Concentration', severity: 'LOW', leadTime: 120, type: 'Transaction', description: 'High buyer concentration risk (HHI > 0.8)' },
  { id: 'S08', name: 'Balance Depletion', severity: 'HIGH', leadTime: 20, type: 'Transaction', description: 'Rapid account balance depletion' },
  { id: 'S09', name: 'GSTR-1 vs 3B Delay', severity: 'MEDIUM', leadTime: 40, type: 'Compliance', description: 'Mismatch between GSTR-1 and 3B filing dates' },
  { id: 'S10', name: 'E-Way Value Mismatch', severity: 'MEDIUM', leadTime: 35, type: 'Compliance', description: 'E-Way bill declarations not matching GSTR-1' },
  { id: 'S11', name: 'Credit Note Surge', severity: 'LOW', leadTime: 60, type: 'Compliance', description: 'Unusual increase in credit notes issued' },
  { id: 'S12', name: 'Tax Notice Active', severity: 'HIGH', leadTime: 10, type: 'Compliance', description: 'Tax authorities notice flag active' },
  { id: 'S13', name: 'Circular Topology', severity: 'CRITICAL', leadTime: 0, type: 'Fraud', description: 'NetworkX detected circular transaction ring' },
  { id: 'S14', name: 'Sectoral Downturn', severity: 'MEDIUM', leadTime: 150, type: 'Macro', description: 'NIC sector showing economic downturn' },
  { id: 'S15', name: 'Legal Caution List', severity: 'HIGH', leadTime: 15, type: 'Legal', description: 'Hit on MCA/CBI Caution List' },
  { id: 'S16', name: 'Promoter CIBIL Drop', severity: 'HIGH', leadTime: 60, type: 'External', description: 'Sudden drop in promoter personal CIBIL' },
  { id: 'S17', name: 'GST Cancellation', severity: 'CRITICAL', leadTime: 0, type: 'Terminal', description: 'GST registration cancelled' }
];

const severityColors = {
  CRITICAL: 'bg-red-500 text-white',
  HIGH: 'bg-orange-500 text-white',
  MEDIUM: 'bg-amber-400 text-slate-900',
  LOW: 'bg-blue-400 text-white'
};

const typeColors = {
  Host: 'bg-slate-100 text-slate-600',
  Transaction: 'bg-emerald-100 text-emerald-700',
  Compliance: 'bg-amber-100 text-amber-700',
  Fraud: 'bg-red-100 text-red-700',
  Macro: 'bg-blue-100 text-blue-700',
  Legal: 'bg-purple-100 text-purple-700',
  External: 'bg-pink-100 text-pink-700',
  Terminal: 'bg-slate-900 text-white'
};

function SentinelDetail() {
  const { data, alerts, fetchAmnestyPreview, activeGstin } = useDashboard();
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [activeSignals, setActiveSignals] = useState([]);
  const [showForensics, setShowForensics] = useState(false);

  useEffect(() => {
    if (showForensics && activeGstin) {
      fetchAmnestyPreview(activeGstin);
    }
  }, [showForensics, activeGstin, fetchAmnestyPreview]);

  // Simulate fetching active signals
  useEffect(() => {
    // Mock active signals based on data
    const mockActive = ['S05', 'S07', 'S13'];
    setActiveSignals(mockActive);
  }, [data]);

  const handleSignalClick = (signal) => {
    setSelectedSignal(signal);
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-primary" size={28} />
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter">SENTINEL // Early Warning System</h1>
        </div>
        <p className="text-slate-500 text-sm">17 Pre-NPA Signals with Lead Time Analysis</p>
      </div>

      {/* Stats Bar */}
      {/* Policy Intelligence Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4">
              <Sparkles className="text-emerald-500 animate-pulse" size={24} />
           </div>
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Policy Engine // Logic</h3>
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <div>
                    <div className="text-xl font-black text-slate-800">GST Amnesty Q3-FY2024</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Notification S.O. 42(E) // Active</div>
                 </div>
                 <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black border border-emerald-100">
                    STATUS: ENFORCED
                 </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                 Neutralizing `filing_delays` and `compliance_floor` heuristics for all MSMEs with annual turnover below ₹5Cr. 
                 Post-hoc correction applied to ensure credit access during recovery windows.
              </p>
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Neutralized</div>
                    <div className="text-xs font-bold text-slate-700">Filing Penalties</div>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Floor-Set</div>
                    <div className="text-xs font-bold text-slate-700">0.85 Compliance</div>
                 </div>
              </div>
              <button 
                onClick={() => setShowForensics(!showForensics)}
                className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  showForensics 
                    ? 'bg-slate-900 text-emerald-400' 
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                {showForensics ? 'Hide Forensic Trace' : 'View Forensic Trace'}
              </button>
           </div>
        </div>
        
        {showForensics ? (
          <div className="w-full h-full animate-in fade-in slide-in-from-right-4 duration-500">
            <AmnestyForensicTraceCard />
          </div>
        ) : (
          data?.amnesty_info?.applied && (
             <AmnestyForensicPanel previewData={{
               baseline_score: data.credit_score - data.amnesty_info.boost,
               amnesty_score: data.credit_score,
               boost: data.amnesty_info.boost,
               is_eligible: true,
               neutralized_factors: ["filing_delays", "compliance_score"]
             }} />
          )
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="text-3xl font-black text-red-500">3</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical Alerts</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="text-3xl font-black text-orange-500">5</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">High Priority</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="text-3xl font-black text-emerald-500">12</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signals Clear</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="text-3xl font-black text-primary">17</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Monitored</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signal Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
          {sentinelSignals.map((signal) => {
            const isActive = activeSignals.includes(signal.id);
            return (
              <button
                key={signal.id}
                onClick={() => handleSignalClick(signal)}
                className={`
                  relative p-4 rounded-2xl border text-left transition-all duration-200
                  ${isActive 
                    ? 'bg-white border-red-300 shadow-lg shadow-red-100' 
                    : 'bg-white/60 border-slate-200 hover:bg-white hover:border-primary/30'
                  }
                  ${selectedSignal?.id === signal.id ? 'ring-2 ring-primary' : ''}
                `}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-2 mb-2">
                  <span className={`
                    text-[10px] font-bold px-2 py-0.5 rounded
                    ${severityColors[signal.severity]}
                  `}>
                    {signal.id}
                  </span>
                  <span className={`
                    text-[9px] font-semibold px-1.5 py-0.5 rounded
                    ${typeColors[signal.type]}
                  `}>
                    {signal.type}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-800 mb-1 line-clamp-1">
                  {signal.name}
                </h3>

                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock size={10} />
                  <span>{signal.leadTime}d lead</span>
                </div>

                {isActive && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-red-600 font-semibold">
                    <AlertTriangle size={10} />
                    <span>TRIGGERED</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedSignal ? (
            <div className="bg-slate-900 rounded-3xl p-6 text-white sticky top-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className={`
                    text-[10px] font-bold px-2 py-0.5 rounded mb-2 inline-block
                    ${severityColors[selectedSignal.severity]}
                  `}>
                    {selectedSignal.id}
                  </span>
                  <h2 className="text-lg font-bold">{selectedSignal.name}</h2>
                </div>
                <button 
                  onClick={() => setSelectedSignal(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-slate-300 mb-6">
                {selectedSignal.description}
              </p>

              {/* Lead Time Chart */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Lead Time Remaining</span>
                  <span className="text-lg font-bold text-primary">{selectedSignal.leadTime} days</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.min((selectedSignal.leadTime / 150) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Raw Data Preview */}
              {activeSignals.includes(selectedSignal.id) && (
                <div className="border-t border-slate-800 pt-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <Activity size={12} />
                    Raw Trigger Data
                  </h4>
                  <div className="bg-slate-800 rounded-xl p-3 font-mono text-[10px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">timestamp:</span>
                      <span className="text-emerald-400">{new Date().toISOString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">signal_id:</span>
                      <span className="text-amber-400">{selectedSignal.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">severity:</span>
                      <span className="text-red-400">{selectedSignal.severity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">triggered:</span>
                      <span className="text-red-400">true</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Signal size={16} />
                View Full Analysis
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div className="sticky top-8 space-y-6">
               <Alerts alerts={alerts} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SentinelDetail;
