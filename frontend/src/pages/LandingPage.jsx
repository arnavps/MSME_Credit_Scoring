import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { AlertCircle, Loader2, Zap, Activity, Eye, Network, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ROYAL_BLUE = '#4338CA';
const SUCCESS_GREEN = '#10B981';

const SentinelTicker = () => {
  const signals = [
    "S13: CIRCULAR TOPOLOGY DETECTED — RISK ADJUSTED",
    "T2: GST AMNESTY APPLIED — NEUTRALIZING FILING DELAYS",
    "S01: OBSERVED UPI CADENCE SHIFT — UPDATING SECTOR MULTIPLIERS",
    "S05: CHEQUE/NACH BOUNCE INCIDENCE — ALERT TRIGGERED",
    "S11: CASH-FLOW DEBT THRESHOLD — RECALIBRATING SCORE"
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-4 overflow-hidden z-[100] shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
      <div className="flex animate-ticker whitespace-nowrap gap-16">
        {[...signals, ...signals, ...signals].map((signal, i) => (
          <span key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-6">
            <span className="w-1.5 h-1.5 bg-royal/20 rounded-full" />
            {signal}
          </span>
        ))}
      </div>
    </div>
  );
};

const NetworkTopologyWidget = () => (
  <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-slate-50/50 backdrop-blur rounded-3xl border border-slate-100 p-4 shadow-xl z-50 animate-float overflow-hidden">
    <div className="flex items-center gap-2 mb-3">
      <Network size={12} className="text-red-500" />
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Loop Detection</span>
    </div>
    <div className="relative h-24 flex items-center justify-center">
      <div className="absolute w-20 h-20 border border-red-100 rounded-full animate-spin-slow" />
      <div className="absolute w-20 h-20 border-t-2 border-red-500 rounded-full animate-spin" />
      
      {/* 3 Nodes */}
      {[0, 120, 240].map(deg => (
        <div key={deg} className="absolute w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" style={{ transform: `rotate(${deg}deg) translateY(-40px)` }} />
      ))}
      
      <div className="text-[10px] font-black text-red-500 font-mono">#83AS-2</div>
    </div>
    <div className="mt-2 text-[7px] font-bold text-center text-red-400 uppercase">Circular Topology Identified</div>
  </div>
);

const LiveFeedMockup = () => {
  const scoreData = [
    { value: 742, fill: ROYAL_BLUE },
    { value: 158, fill: '#f1f5f9' }
  ];

  return (
    <div className="relative">
      <NetworkTopologyWidget />
      
      <div className="browser-mockup w-[720px] aspect-[16/11] flex flex-col scale-110 shadow-2xl relative bg-white border border-slate-100 rounded-[32px] overflow-hidden">
        <div className="h-12 bg-slate-50/80 backdrop-blur border-b border-slate-100 flex items-center px-6 gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400/20" />
            <div className="w-3 h-3 rounded-full bg-amber-400/20" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/20" />
          </div>
          <div className="flex-1 max-w-sm mx-auto h-7 bg-white border border-slate-200 rounded-xl text-[10px] flex items-center px-4 text-slate-400 font-mono italic">
            intelligence.crednexis.ai/observe/node-sync
          </div>
        </div>

        <div className="flex-1 p-8 grid grid-cols-12 gap-6">
          <div className="col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center space-y-4 relative">
            <div className="absolute top-4 right-4 group">
               <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black flex items-center gap-1.5 border border-emerald-100 animate-pulse">
                  <ShieldCheck size={10} /> AMNESTY ACTIVE
               </div>
               {/* Tooltip */}
               <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-900 text-white text-[9px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60]">
                  Score adjusted +42 pts per Q3-FY2024 Policy. High-risk filing delays neutralized.
               </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-royal" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Reliability</span>
            </div>
            <div className="relative h-40 w-40 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={scoreData} innerRadius={50} outerRadius={70} startAngle={180} endAngle={0} dataKey="value" stroke="none">
                    <Cell fill={ROYAL_BLUE} />
                    <Cell fill="#f1f5f9" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-x-0 bottom-8 flex flex-col items-center">
                <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">742</span>
                <span className="text-[10px] font-black text-royal uppercase tracking-widest mt-2">Elite Band</span>
              </div>
            </div>
          </div>

          <div className="col-span-7 bg-slate-900 rounded-3xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Eye size={16} className="text-royal" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono">The Sentinel // Observability</span>
            </div>
            <div className="flex-1 space-y-4">
              {[
                { s: 'S05', n: 'CHEQUE BOUNCE', a: true },
                { s: 'S09', n: 'GST FILING DELAYS', a: false },
                { s: 'S13', n: 'CIRCULAR TOPOLOGY', a: false }
              ].map(item => (
                <div key={item.s} className="flex items-center justify-between py-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-slate-600 bg-white/5 px-2 py-0.5 rounded">{item.s}</span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">{item.n}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${item.a ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`} />
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/5">
               <span className="text-[9px] font-black text-royal uppercase tracking-widest">+ 14 REAL-TIME SIGNALS ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function LandingPage() {
  const { fetchScoreData, loading, error } = useDashboard();
  const [gstin, setGstin] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (gstin.trim()) {
      fetchScoreData(gstin.trim());
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-royal selection:text-white flex flex-col relative overflow-x-hidden font-inter">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl z-[110] px-8 lg:px-24 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-royal rounded-xl flex items-center justify-center shadow-lg shadow-royal/20">
            <Zap className="text-white fill-current" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
            CredNexis <span className="text-royal">AI</span>
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-16">
          {['Dashboard', 'Sentinel', 'Network', 'Amnesty'].map(link => (
            <button key={link} className="text-[11px] font-black tracking-[0.3em] text-slate-400 hover:text-royal transition-all uppercase">
              {link}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-10">
          <button onClick={() => navigate('/login')} className="text-[11px] font-black tracking-[0.2em] text-slate-900 uppercase">
            Portal Access
          </button>
          <button onClick={() => navigate('/login')} className="px-10 py-3.5 bg-royal text-white text-[11px] font-black tracking-[0.2em] uppercase rounded-xl shadow-xl shadow-royal/20 hover:scale-[1.02] transition-all active:scale-[0.98]">
            Sign Up
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 w-full px-8 lg:px-24 pt-32 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[70vh] gap-12">
          
          {/* LEFT: Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center relative z-10">
            <h1 className="font-black text-slate-900 tracking-tighter uppercase mb-2" style={{ fontSize: '7vw', lineHeight: '0.85' }}>
              SENSE THE RISK. 
            </h1>
            <h1 className="font-black text-royal tracking-tighter uppercase" style={{ fontSize: '7.5vw', lineHeight: '0.85' }}>
              SHIFT THE POLICY.
            </h1>

            <p className="text-slate-500 font-bold text-xl leading-relaxed mt-12 max-w-[580px]">
              Multi-signal credit intelligence for India's 64 million MSMEs. Our system detects circular fraud rings in milliseconds and adapts to government GST amnesty schemes instantly—no retraining, no downtime.
            </p>

            <form onSubmit={handleAnalyze} className="mt-16 w-full max-w-2xl flex flex-col md:flex-row gap-4 relative group">
              <input 
                type="text" 
                value={gstin} 
                onChange={(e) => setGstin(e.target.value.toUpperCase())} 
                placeholder="Enter 15-digit MSME GSTIN..." 
                className="flex-1 bg-white border border-slate-200 rounded-2xl py-6 px-8 text-xl font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all" 
              />
              <button 
                type="submit" 
                disabled={loading} 
                className="bg-royal text-white px-12 py-6 text-xs font-black tracking-[0.3em] rounded-2xl shadow-2xl shadow-royal/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'ENTER GSTIN FOR INSTANT X-RAY'}
              </button>
              {error && (
                <div className="absolute top-full mt-4 flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 px-4 py-2 border border-red-100 rounded-xl">
                  <AlertCircle size={14} />{error}
                </div>
              )}
            </form>
          </div>

          {/* RIGHT: Mockup */}
          <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center overflow-visible">
            <LiveFeedMockup />
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-40 -z-10" />
          </div>
        </div>

        {/* INTERACTIVE TWIST FEATURE GRID */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Twist 1 */}
           <div className="bg-white border border-slate-100 p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all group scale-100 hover:scale-[1.02]">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-[24px] flex items-center justify-center mb-8 border border-red-100 group-hover:scale-110 transition-transform">
                 <Network size={32} />
              </div>
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">Fraud Topology</h4>
              <p className="text-slate-500 font-bold leading-relaxed text-sm">
                 Visualizes circular UPI rotation patterns. We identify the fraud ring, not just the score. Automated graph modeling surfaces high-velocity nodes instantly.
              </p>
           </div>

           {/* Twist 2 */}
           <div className="bg-white border border-slate-100 p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all group scale-100 hover:scale-[1.02]">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[24px] flex items-center justify-center mb-8 border border-emerald-100 group-hover:scale-110 transition-transform">
                 <ShieldCheck size={32} />
              </div>
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">Amnesty Engine</h4>
              <p className="text-slate-500 font-bold leading-relaxed text-sm">
                 Dynamic feature neutralizing. Late GST filings during amnesty windows are automatically corrected post-hoc—ensuring fair lending and policy agility.
              </p>
           </div>

           {/* Twist 3 */}
           <div className="bg-white border border-slate-100 p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all group scale-100 hover:scale-[1.02]">
              <div className="w-16 h-16 bg-indigo-50 text-royal rounded-[24px] flex items-center justify-center mb-8 border border-indigo-100 group-hover:scale-110 transition-transform">
                 <Cpu size={32} />
              </div>
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">Explainable Trace</h4>
              <p className="text-slate-500 font-bold leading-relaxed text-sm">
                 Every 630 score is backed by a 5-stage inference timeline and SHAP-driven catalysts. Pure forensic transparency for industrial banking auditors.
              </p>
           </div>
        </div>

        {/* SECONDARY CTA / SOCIAL PROOF */}
        <div className="mt-40 bg-royal rounded-[48px] p-24 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
           
           <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-6 relative z-10">
              Ready to verify the next 64M?
           </h2>
           <p className="text-indigo-100 font-bold text-xl mb-12 max-w-2xl mx-auto opacity-80 relative z-10">
              Deploy our industrial-grade credit intelligence stack in under 15 minutes. Pure API logic, world-class forensic accuracy.
           </p>
           <button className="bg-white text-royal px-16 py-6 rounded-2xl text-xs font-black tracking-[0.3em] uppercase hover:scale-105 transition-all shadow-2xl relative z-10">
              Request Platform Audit <ArrowRight size={16} className="inline-block ml-4" />
           </button>
        </div>
      </main>

      <SentinelTicker />

      {/* CUSTOM STYLE INJECTION */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin {
           animation: spin-slow 2s linear infinite;
        }
        .text-royal { color: ${ROYAL_BLUE}; }
        .bg-royal { background-color: ${ROYAL_BLUE}; }
      `}} />
    </div>
  );
}

export default LandingPage;
