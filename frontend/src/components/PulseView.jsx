import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Activity, Zap, Shield, Brain, Target } from 'lucide-react';

// 5 Model Ensemble Configuration
const modelConfig = [
  {
    id: 'lightgbm',
    name: 'Boosting Engine',
    subtitle: 'LightGBM Primary',
    icon: Zap,
    color: 'emerald',
    weight: 0.40,
    description: 'Primary scorer. 500 estimators. SMOTE balanced.'
  },
  {
    id: 'xgboost',
    name: 'Fraud Detector',
    subtitle: 'XGBoost Classifier',
    icon: Shield,
    color: 'red',
    weight: 0.20,
    description: 'Circular transaction detection. Feature importance ranking.'
  },
  {
    id: 'catboost',
    name: 'Sector Expert',
    subtitle: 'CatBoost Calibrator',
    icon: Brain,
    color: 'blue',
    weight: 0.15,
    description: 'Sector-specific adjustments. Macro stress integration.'
  },
  {
    id: 'isolation',
    name: 'Anomaly Hunter',
    subtitle: 'Isolation Forest',
    icon: Target,
    color: 'purple',
    weight: 0.15,
    description: 'Unsupervised outlier detection. Pattern anomaly flagging.'
  },
  {
    id: 'randomforest',
    name: 'Baseline Anchor',
    subtitle: 'Random Forest',
    icon: Activity,
    color: 'amber',
    weight: 0.10,
    description: 'Variance check. Model disagreement detection.'
  }
];

// Mini Gauge Component
function MiniGauge({ model, rawScore, finalScore }) {
  const Icon = model.icon;
  const percentage = Math.min(Math.max((rawScore / 900) * 100, 0), 100);

  const colorClasses = {
    emerald: 'from-emerald-500 to-emerald-600',
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-500 to-amber-600'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[model.color]} flex items-center justify-center shadow-lg`}>
            <Icon className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{model.name}</h3>
            <p className="text-[10px] text-slate-500">{model.subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-slate-800">{Math.round(rawScore)}</div>
          <div className="text-[10px] text-slate-400 font-semibold">raw output</div>
        </div>
      </div>

      {/* Gauge Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>300</span>
          <span className="font-bold text-slate-600">{model.weight * 100}% weight</span>
          <span>900</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${colorClasses[model.color]} rounded-full transition-all duration-700`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Score Detail */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <p className="text-[10px] text-slate-500 leading-tight flex-1">{model.description}</p>
        <div className="text-right ml-3">
          <div className="text-xs font-bold text-slate-700">
            +{Math.round((rawScore - 300) * model.weight)} pts
          </div>
          <div className="text-[9px] text-slate-400">to final</div>
        </div>
      </div>
    </div>
  );
}

function PulseView() {
  const { data, scoreHistory = [] } = useDashboard();

  // Calculate mock raw scores for each model (normally from API)
  const baseScore = data?.credit_score || 650;
  const modelScores = {
    lightgbm: Math.min(900, baseScore + 20),
    xgboost: Math.min(900, baseScore - 30),
    catboost: Math.min(900, baseScore + 15),
    isolation: Math.min(900, baseScore - 40),
    randomforest: Math.min(900, baseScore + 25)
  };

  // Calculate weighted final
  const weightedScore = Math.round(
    modelScores.lightgbm * 0.40 +
    modelScores.xgboost * 0.20 +
    modelScores.catboost * 0.15 +
    modelScores.isolation * 0.15 +
    modelScores.randomforest * 0.10
  );

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="text-primary" size={28} />
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter">PULSE // Ensemble Result</h1>
        </div>
        <p className="text-slate-500 text-sm">5-Model Architecture Raw Output Visualization</p>
      </div>

      {/* Final Score Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Final Calibrated Score
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-black">{data?.credit_score || weightedScore}</span>
              <span className="text-2xl text-slate-400">/ 900</span>
            </div>
            <div className="text-sm text-slate-400 mt-2">
              CMR-4 Equivalent • {data?.risk_band || 'MEDIUM'} Risk
            </div>
          </div>

          {/* Score Trend Mini */}
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Rolling Average (5-point)
            </div>
            <div className="text-3xl font-bold text-emerald-400">
              {scoreHistory?.length >= 5
                ? Math.round(scoreHistory.slice(-5).reduce((a, b) => a + (b.score || 0), 0) / 5)
                : baseScore}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {scoreHistory?.length > 0 ? `${scoreHistory.length} samples in buffer` : 'Buffering...'}
            </div>
          </div>
        </div>
      </div>

      {/* 5 Mini Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {modelConfig.map((model) => (
          <MiniGauge
            key={model.id}
            model={model}
            rawScore={modelScores[model.id]}
            finalScore={data?.credit_score || weightedScore}
          />
        ))}
      </div>

      {/* Ensemble Logic Explanation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Ensemble Fusion Logic</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase">Primary (40%)</span>
            </div>
            <p className="text-xs text-slate-600">
              LightGBM serves as the primary scorer with SMOTE balancing for class imbalance.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-bold uppercase">Specialized (35%)</span>
            </div>
            <p className="text-xs text-slate-600">
              XGBoost + CatBoost + Isolation Forest handle specific risk dimensions.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-600">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-bold uppercase">Anchor (25%)</span>
            </div>
            <p className="text-xs text-slate-600">
              Random Forest acts as variance check anchor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PulseView;
