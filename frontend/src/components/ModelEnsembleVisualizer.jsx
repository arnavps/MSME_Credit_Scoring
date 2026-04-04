import React, { memo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  GitMerge,
  Scale,
  ShieldAlert,
  Search,
  Factory,
  Anchor,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Cpu,
  Sparkles
} from 'lucide-react';

const ModelEnsembleVisualizer = memo(() => {
  const { data, activeGstin } = useDashboard();

  if (!data) {
    return (
      <div className="bento-card h-full flex flex-col items-center justify-center">
        <Cpu className="text-slate-200 mb-4" size={48} strokeWidth={1} />
        <p className="text-sm font-bold text-slate-400">Enter a GSTIN to view 5-Model Ensemble</p>
      </div>
    );
  }

  // Model definitions with their roles
  const models = [
    {
      id: 'lgbm',
      name: 'The Main Judge',
      type: 'LightGBM',
      role: 'Primary Credit Scorer',
      description: 'Core scoring engine using 600 estimators with SMOTE-balanced training',
      score: data?.credit_score || 630,
      contribution: 'Base Score (300-900 range)',
      icon: Scale,
      color: 'bg-emerald-500',
      status: 'active'
    },
    {
      id: 'fraud',
      name: 'The Fraud Detective',
      type: 'XGBoost',
      role: 'Fraud Detection',
      description: 'Detects circular transactions using buyer concentration & velocity patterns',
      contribution: data?.fraudAnalysis?.is_circular ? 'Fraud Penalty: -50%' : 'No fraud detected',
      icon: ShieldAlert,
      color: data?.fraudAnalysis?.is_circular ? 'bg-red-500' : 'bg-slate-400',
      status: data?.fraudAnalysis?.is_circular ? 'triggered' : 'passive'
    },
    {
      id: 'anomaly',
      name: 'The Anomaly Hunter',
      type: 'Isolation Forest',
      role: 'Anomaly Detection',
      description: 'Detects outliers using 300 trees trained exclusively on real-world V2 data',
      contribution: 'Anomaly flag check',
      icon: Search,
      color: 'bg-amber-500',
      status: 'monitoring'
    },
    {
      id: 'sector',
      name: 'The Industry Specialist',
      type: 'CatBoost',
      role: 'Sector Calibration',
      description: 'Adjusts score based on sector-specific patterns (Retail, Manufacturing, etc.)',
      contribution: '±20 point adjustment',
      icon: Factory,
      color: 'bg-blue-500',
      status: 'active'
    },
    {
      id: 'baseline',
      name: 'The Baseline Anchor',
      type: 'Random Forest',
      role: 'Variance Check',
      description: 'Provides baseline comparison - triggers manual review if variance > 15%',
      contribution: data?.review_flags?.manual_review_required ? 'Manual review triggered' : 'Within variance bounds',
      icon: Anchor,
      color: data?.review_flags?.manual_review_required ? 'bg-amber-500' : 'bg-slate-400',
      status: data?.review_flags?.manual_review_required ? 'warning' : 'passive'
    }
  ];

  return (
    <div className="bento-card h-full flex flex-col">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">
            Ensemble // 5-Model Architecture
          </span>
          <h3 className="text-xl font-black text-slate-800 tracking-tighter">Model Interaction</h3>
        </div>
        <div className="flex items-center gap-2">
          <GitMerge className="text-royal" size={20} strokeWidth={1} />
          <span className="text-[10px] font-black text-royal bg-royal/10 px-2.5 py-1 rounded-lg uppercase tracking-widest">
            Ensemble Voting
          </span>
        </div>
      </div>

      {/* Ensemble Flow */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        
        {/* Step 1: Input */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-royal/10 flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-royal" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Input Features
            </span>
            <span className="text-sm font-bold text-slate-700">
              ~20 features (GST, UPI, E-way, Promoter CIBIL)
            </span>
          </div>
        </div>

        <ArrowRight className="mx-auto text-slate-300" size={20} />

        {/* Step 2: Primary Scorer (LightGBM) */}
        <div className="relative">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <Scale size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  Step 1: Primary Score
                </span>
                <CheckCircle2 size={14} className="text-emerald-500" />
              </div>
              <span className="text-sm font-bold text-slate-800 block">
                LightGBM (The Main Judge)
              </span>
              <span className="text-xs text-slate-500">
                Base Score: {data?.credit_score || 630} | PD converted to 300-900 range
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-600">
                {data?.credit_score || 630}
              </span>
            </div>
          </div>
        </div>

        <ArrowRight className="mx-auto text-slate-300" size={20} />

        {/* Step 3: Parallel Specializations */}
        <div className="grid grid-cols-2 gap-3">
          {/* Fraud Detection */}
          <div className={`p-3 border rounded-xl ${data?.fraudAnalysis?.is_circular ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${data?.fraudAnalysis?.is_circular ? 'bg-red-500' : 'bg-slate-400'}`}>
                <ShieldAlert size={16} className="text-white" />
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Step 2a: Fraud Check
              </span>
            </div>
            <span className="text-xs font-bold text-slate-700 block">XGBoost + Isolation Forest</span>
            <span className={`text-[10px] ${data?.fraudAnalysis?.is_circular ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
              {data?.fraudAnalysis?.is_circular ? 'FRAUD DETECTED: -50% penalty' : 'No fraud signals'}
            </span>
          </div>

          {/* Sector Calibration */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Factory size={16} className="text-white" />
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Step 2b: Sector Calib.
              </span>
            </div>
            <span className="text-xs font-bold text-slate-700 block">CatBoost (Industry Specialist)</span>
            <span className="text-[10px] text-slate-500">
              ±20 point sector adjustment
            </span>
          </div>
        </div>

        <ArrowRight className="mx-auto text-slate-300" size={20} />

        {/* Step 4: Baseline Variance Check */}
        <div className={`flex items-center gap-3 p-3 border rounded-xl ${data?.review_flags?.manual_review_required ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${data?.review_flags?.manual_review_required ? 'bg-amber-500' : 'bg-slate-400'}`}>
            <Anchor size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Step 3: Variance Check
            </span>
            <span className="text-sm font-bold text-slate-700">
              Random Forest Baseline
            </span>
            <span className={`text-xs ${data?.review_flags?.manual_review_required ? 'text-amber-600 font-bold' : 'text-slate-500'}`}>
              Variance: {data?.review_flags?.baseline_variance_pct || 0}% 
              {data?.review_flags?.manual_review_required ? ' > 15% threshold - Review required' : ' (within bounds)'}
            </span>
          </div>
          {data?.review_flags?.manual_review_required && (
            <AlertTriangle size={20} className="text-amber-500" />
          )}
        </div>

        <ArrowRight className="mx-auto text-slate-300" size={20} />

        {/* Step 5: Final Score */}
        <div className="flex items-center gap-3 p-4 bg-royal/10 border-2 border-royal/30 rounded-xl">
          <div className="w-12 h-12 rounded-xl bg-royal flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-black text-royal uppercase tracking-widest block">
              Final Ensemble Output
            </span>
            <span className="text-sm font-bold text-slate-800">
              Consensus Score with Fraud Penalties & Amnesty
            </span>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-royal">
              {data?.credit_score || 630}
            </span>
          </div>
        </div>

        {/* Model Legend */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
            5-Model Stack Legend
          </span>
          <div className="grid grid-cols-2 gap-2">
            {models.map((model) => (
              <div key={model.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${model.color}`} />
                <span className="text-[10px] font-bold text-slate-600 truncate">
                  {model.type}: {model.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ModelEnsembleVisualizer;
