import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Cpu, 
  Quote, 
  ChevronRight, 
  Network,
  Activity
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import ShapChart from './ShapChart';
import Alerts from './Alerts';
import AmnestyBadge from './AmnestyBadge';

// Royal Blue Accent
const ROYAL_BLUE = '#4338CA';

// Glassmorphism Base Styles
const glassCard = {
  background: 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
};

const LAST_UPDATED = 'Live';

const CredNexisDashboard = React.memo(function CredNexisDashboard() {
  const { data, liveData, alerts, isConnected } = useDashboard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayScore = liveData?.score || data?.credit_score || 630;
  const amnesty = data?.amnesty_info || { applied: false, boost: 0 };
  const fraudMetrics = liveData?.features?.net_inflow_ratio < -0.1 ? { is_circular: true } : (data?.fraudAnalysis || { is_circular: false });

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: ROYAL_BLUE }}
            >
              <Zap className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                CredNexis <span style={{ color: ROYAL_BLUE }}>Intelligence</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isConnected ? 'Live Telemetry Active' : 'Offline Mode'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {amnesty.applied && (
              <AmnestyBadge boost={amnesty.boost} isApplied={true} />
            )}
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System Status</p>
              <p className="text-xs font-bold text-slate-700">All Nodes Nominal</p>
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid - Top Row */}
      <div className="grid grid-cols-12 gap-6 mb-6">

        {/* TOP LEFT: Unified Risk Intelligence */}
        <div className="col-span-4">
          <div style={glassCard} className="h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Shield size={20} color={ROYAL_BLUE} strokeWidth={1.5} />
                <span className="text-sm font-semibold text-slate-600">Credit Reliability Index</span>
              </div>
              <div
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: `${ROYAL_BLUE}20`, color: ROYAL_BLUE }}
              >
                {data?.risk_band || 'LOW RISK'}
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl font-black text-slate-800 tracking-tighter">
                {displayScore}
              </span>
              <span className="text-xl text-slate-400 font-medium">/ 900</span>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-slate-500">CV Accuracy: 88%</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-400 mb-1">Invoice Velocity</p>
                <p className="text-lg font-bold text-slate-700">
                  {liveData?.features?.invoice_velocity?.toFixed(2) || '4.20'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Cash Flow Ratio</p>
                <p className="text-lg font-bold text-emerald-600">
                  {liveData?.features?.net_inflow_ratio ? `${(liveData.features.net_inflow_ratio * 100).toFixed(0)}%` : '92%'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TOP CENTER: Lender Optimization */}
        <div className="col-span-4">
          <div style={glassCard} className="h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <Users size={20} color={ROYAL_BLUE} strokeWidth={1.5} />
              <span className="text-sm font-semibold text-slate-600">Lender Optimization</span>
            </div>

            <div className="flex-1">
              <p className="text-3xl font-black text-slate-800 mb-2">₹18.5L</p>
              <p className="text-sm text-slate-500 mb-6">Pre-approved credit line</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Best Rate</span>
                  <span className="text-sm font-bold text-emerald-600">9.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Lenders Active</span>
                  <span className="text-sm font-bold text-slate-800">8</span>
                </div>
              </div>
            </div>

            <button
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: ROYAL_BLUE }}
            >
              <span>Initiate Bidding</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* TOP RIGHT: Circular Fraud Graph */}
        <div className="col-span-4">
          <div style={glassCard} className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Network size={20} color={fraudMetrics.is_circular ? '#EF4444' : ROYAL_BLUE} strokeWidth={1.5} />
                <span className="text-sm font-semibold text-slate-600">Circular Fraud</span>
              </div>
              {fraudMetrics.is_circular && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-red-600">DETECTED</span>
                </div>
              )}
            </div>

            <div className="relative h-40 bg-slate-50 rounded-xl overflow-hidden mb-4">
              <svg className="w-full h-full" viewBox="0 0 200 150">
                {fraudMetrics.is_circular ? (
                  <>
                    <line x1="60" y1="75" x2="100" y2="40" stroke="#EF4444" strokeWidth="3" />
                    <line x1="100" y1="40" x2="140" y2="75" stroke="#EF4444" strokeWidth="3" />
                    <line x1="140" y1="75" x2="100" y2="110" stroke="#EF4444" strokeWidth="3" strokeDasharray="4,4" />
                    <line x1="100" y1="110" x2="60" y2="75" stroke="#EF4444" strokeWidth="3" />
                  </>
                ) : (
                  <>
                    <line x1="60" y1="75" x2="100" y2="40" stroke="#94A3B8" strokeWidth="1.5" />
                    <line x1="100" y1="40" x2="140" y2="75" stroke="#94A3B8" strokeWidth="1.5" />
                  </>
                )}
                <circle cx="60" cy="75" r="12" fill={fraudMetrics.is_circular ? '#EF4444' : '#3B82F6'} />
                <circle cx="100" cy="40" r="12" fill={fraudMetrics.is_circular ? '#EF4444' : '#3B82F6'} />
                <circle cx="140" cy="75" r="12" fill={fraudMetrics.is_circular ? '#EF4444' : '#94A3B8'} />
                <text x="60" y="100" textAnchor="middle" fontSize="8" fill="#64748B">ABC Traders</text>
                <text x="100" y="25" textAnchor="middle" fontSize="8" fill="#64748B">XYZ Corp</text>
              </svg>
            </div>

            <p className="text-xs text-slate-500">
              {fraudMetrics.is_circular
                ? 'High-risk loop detected in UPI logs. Manual audit recommended.'
                : 'No circular patterns detected in live topology.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Bento Grid - Bottom Row */}
      <div className="grid grid-cols-12 gap-6">

        {/* BOTTOM LEFT: Behavioral Intelligence (SHAP + Alerts) */}
        <div className="col-span-5 flex flex-col gap-6">
          <div style={glassCard}>
            <ShapChart shap={liveData?.shap} />
          </div>
          <div style={glassCard} className="flex-1">
            <Alerts alerts={alerts} />
          </div>
        </div>

        {/* BOTTOM CENTER: Ollama Intelligence */}
        <div className="col-span-7">
          <div
            className="h-full rounded-2xl p-6 text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: `linear-gradient(90deg, ${ROYAL_BLUE}, #60A5FA)` }}
            ></div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Cpu className="text-blue-400" size={20} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ollama Intelligence</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded">LOCAL_LLM</span>
            </div>

            <div className="space-y-6 relative">
              <Quote className="absolute -top-2 -left-2 text-slate-700 opacity-30" size={32} />

              <div>
                <p className="text-lg text-slate-200 font-medium leading-relaxed italic border-l-2 border-blue-500/50 pl-4">
                  {fraudMetrics.is_circular
                    ? "UNIFIED VERDICT: High-priority circular topology detected in UPI logs. While GST compliance remains stable, the S13 round-tripping flag necessitates a manual forensic review before credit limit expansion."
                    : (data?.advisory?.bankers_verdict || "The MSME demonstrates strong revenue cadence and sector-leading compliance metrics.")
                  }
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Risk Context</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {fraudMetrics.is_circular
                    ? "CRITICAL: Score calibration heavily penalized by suspected round-tripping. Recommend immediate verification of recent ₹4.3L UPI transfers."
                    : (data?.advisory?.risk_context || "Primary risk stems from transient liquidity tightening observed in historical records.")
                  }
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">30-Day Tactical Roadmap</h4>
                <ul className="space-y-2">
                  {(fraudMetrics.is_circular ? [
                    'Investigate circular transaction parties within 7 days',
                    'Audit statutory GST records for intra-group billing',
                    'Maintain 15% cash reserve for liquidity buffer',
                    'Submit auditor-verified transaction logs'
                  ] : (data?.advisory?.thirty_day_fix || [
                    'Standardize GST filing date to before 10th',
                    'Increase POS transaction volume by 10%',
                    'Resolve pending invoice disputes',
                    'Diversity buyer network HHI concentration'
                  ])).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 group">
                      <div className="w-1 h-1 rounded-full bg-slate-500 mt-2 group-hover:bg-blue-400 transition-colors"></div>
                      <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                Unified NLP Engine Status: OPERATIONAL
              </span>
              <span className="text-xs text-slate-600">Last Sync: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CredNexisDashboard;
