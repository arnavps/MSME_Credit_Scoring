import React, { useState } from 'react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import PulseGauge from '../components/PulseGauge';
import ShapFactors from '../components/ShapFactors';
import FraudTopologyModal from '../components/FraudTopologyModal';
import { useDashboard } from '../context/DashboardContext';
import { Activity, ShieldAlert, Cpu, Layers } from 'lucide-react';

function Dashboard() {
  const { activeGstin } = useDashboard();
  const [isFraudModalOpen, setIsFraudModalOpen] = useState(false);
  const { dashboardData, sentinelData, isLoading, isError } = useSync(activeGstin);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faff]">
      <div className="flex flex-col items-center gap-4">
        <Activity className="text-primary animate-spin" size={48} />
        <p className="text-slate-400 font-medium animate-pulse uppercase tracking-widest text-xs">Synchronizing Intelligence...</p>
      </div>
    </div>
  );

  const score = dashboardData?.score || 0;
  const cmr = dashboardData?.cmr_rank || 'N/A';
  const riskBand = dashboardData?.risk_band || 'N/A';
  const shapFactors = dashboardData?.shap_explanations || [];
  const sentinelSignals = sentinelData?.signals || [];
  const activeAlerts = sentinelSignals.filter(s => s.status === 'CRITICAL').length;

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <Header syncStatus="online" />
      
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Intelligence & SHAP */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <GlassCard title="Risk Factors">
            <ShapFactors factors={shapFactors} />
          </GlassCard>
          
          <GlassCard className="bg-primary/5 border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="text-primary" size={20} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">AI Advisory</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              {dashboardData?.llm_advisory || "Analyzing credit profile..."}
            </p>
          </GlassCard>
        </div>

        {/* Middle Column: The Pulse */}
        <div className="lg:col-span-5">
          <GlassCard className="h-full flex flex-col items-center justify-between py-12 relative overflow-hidden">
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <Activity className="text-primary" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sentinel Real-Time Pulse</span>
            </div>
            
            <PulseGauge 
              score={score} 
              cmr={cmr} 
              riskBand={riskBand} 
            />

            <div className="w-full px-8 mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Exposure</p>
                <p className="text-lg font-bold text-slate-800">₹42.5L</p>
              </div>
              <div className="text-center border-x border-slate-100">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Utilization</p>
                <p className="text-lg font-bold text-slate-800">68%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Deltas</p>
                <p className="text-lg font-bold text-status-low">+4.2%</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: EWS Sentinel & Fraud */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <GlassCard className={activeAlerts > 0 ? "border-status-critical/30 ring-1 ring-status-critical/10" : ""}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShieldAlert className={activeAlerts > 0 ? "text-status-critical" : "text-status-low"} size={20} />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Sentinel EWS</h3>
              </div>
              {activeAlerts > 0 && (
                <span className="px-2 py-0.5 bg-status-critical text-white text-[10px] font-bold rounded animate-pulse">
                  {activeAlerts} ALERTS
                </span>
              )}
            </div>

            <div className="space-y-4">
              {sentinelSignals.slice(0, 5).map((signal, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 border border-slate-100 group hover:border-primary/20 transition-all">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400">{signal.code}</span>
                    <span className="text-xs font-semibold text-slate-700">{signal.signal}</span>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-1 rounded ${
                    signal.status === 'CRITICAL' ? 'bg-status-critical/10 text-status-critical' : 
                    signal.status === 'HEALTHY' ? 'bg-status-low/10 text-status-low' : 'bg-status-moderate/10 text-status-moderate'
                  }`}>
                    {signal.status}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="bg-slate-900 text-white border-none shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Layers className="text-primary" size={20} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Fraud Topology</h3>
            </div>
            <div 
              onClick={() => setIsFraudModalOpen(true)}
              className="h-32 bg-slate-800/50 rounded-xl border border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-all font-bold"
            >
              <div className="flex flex-col items-center gap-2">
                <Activity size={32} className="text-slate-600" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Open Graph Explorer</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs text-slate-400">Circularity Ratio</span>
              <span className="text-xs font-bold text-status-low">0.02% (Safe)</span>
            </div>
          </GlassCard>
        </div>

      </main>

      <FraudTopologyModal 
        isOpen={isFraudModalOpen} 
        onClose={() => setIsFraudModalOpen(false)} 
        data={{
          gstin: activeGstin,
          topology_path: dashboardData?.fraud_metrics?.topology_path
        }}
      />
    </div>
  );
}

export default Dashboard;
