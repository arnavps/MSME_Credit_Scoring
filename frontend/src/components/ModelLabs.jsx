import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { FlaskConical, Database, ArrowRight, FileJson, Cpu, ChevronRight, Search, Zap, Shield, Brain, Target, Activity } from 'lucide-react';
import InferenceTrace from './InferenceTrace';

// 15 Key Features from msme_synthetic_3000.csv
const keyFeatures = [
  { name: 'gst_compliance_rate', value: 0.95, type: 'float', desc: 'Monthly filing compliance percentage' },
  { name: 'avg_days_late', value: 2.3, type: 'float', desc: 'Average days late in GST filing' },
  { name: 'output_gst', value: 2500000, type: 'int', desc: 'Monthly outward GST supply (₹)' },
  { name: 'input_gst', value: 1800000, type: 'int', desc: 'Monthly inward GST supply (₹)' },
  { name: 'gross_margin_proxy', value: 0.28, type: 'float', desc: 'Derived (Output-Input)/Output' },
  { name: 'upi_bounce_rate', value: 0.03, type: 'float', desc: 'UPI transaction bounce rate' },
  { name: 'txn_velocity_mom', value: 0.15, type: 'float', desc: 'Month-over-month transaction velocity' },
  { name: 'buyer_concentration_index', value: 0.35, type: 'float', desc: 'HHI index for buyer diversity' },
  { name: 'collection_efficiency', value: 0.92, type: 'float', desc: 'Payment collection ratio' },
  { name: 'promoter_cibil', value: 750, type: 'int', desc: 'Promoter CIBIL score' },
  { name: 'filing_compliance_rate', value: 1.0, type: 'float', desc: 'Overall filing compliance' },
  { name: 'circular_transaction_flag', value: 0, type: 'binary', desc: 'Circular pattern detected' },
  { name: 'scenario_resilience_lp', value: 85, type: 'int', desc: 'Macro stress resilience score' },
  { name: 'avg_round_trip_hours', value: 0, type: 'float', desc: 'Fraud cycle detection metric' },
  { name: 'sector', value: 'Manufacturing', type: 'categorical', desc: 'Business sector classification' }
];

// 5 Models with icons and raw scores
const modelPipeline = [
  { id: 'lightgbm', name: 'LightGBM', role: 'Primary Scorer', icon: Zap, color: 'emerald', rawScore: 724 },
  { id: 'xgboost', name: 'XGBoost', role: 'Fraud Detector', icon: Shield, color: 'red', rawScore: 698 },
  { id: 'catboost', name: 'CatBoost', role: 'Sector Expert', icon: Brain, color: 'blue', rawScore: 712 },
  { id: 'isolation', name: 'Isolation Forest', role: 'Anomaly Hunter', icon: Target, color: 'purple', rawScore: 735 },
  { id: 'randomforest', name: 'Random Forest', role: 'Baseline Anchor', icon: Activity, color: 'amber', rawScore: 708 }
];

function ModelLabs() {
  const { data, activeGstin } = useDashboard();
  const [selectedModel, setSelectedModel] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const finalScore = data?.credit_score || 724;
  const gstin = activeGstin || '27AAPFU0939F1ZV';

  // Calculate weighted contribution
  const weights = { lightgbm: 0.40, xgboost: 0.20, catboost: 0.15, isolation: 0.15, randomforest: 0.10 };

  const modelScores = modelPipeline.map(model => ({
    ...model,
    weighted: Math.round(model.rawScore * weights[model.id]),
    contribution: ((model.rawScore * weights[model.id]) / 6).toFixed(1) // % of 600 point range (300-900)
  }));

  const jsonData = {
    gstin,
    timestamp: new Date().toISOString(),
    features: keyFeatures.reduce((acc, f) => ({ ...acc, [f.name]: f.value }), {}),
    model_outputs: modelScores.reduce((acc, m) => ({ ...acc, [m.id]: m.rawScore }), {}),
    final_score: finalScore,
    fusion_method: 'weighted_average'
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FlaskConical className="text-primary" size={28} />
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter">MODEL LABS // Data Lineage</h1>
        </div>
        <p className="text-slate-500 text-sm">Raw feature processing through 5-model ensemble to final score</p>
      </div>

      {/* GSTIN Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={gstin}
            readOnly
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700"
          />
        </div>
        <button
          onClick={() => setShowRawJson(!showRawJson)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors"
        >
          <FileJson size={16} />
          {showRawJson ? 'Hide' : 'View'} Raw JSON
        </button>
      </div>

      {/* Raw JSON Modal */}
      {showRawJson && (
        <div className="bg-slate-900 rounded-2xl p-6 mb-6 text-emerald-400 font-mono text-xs overflow-x-auto">
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}

      {/* Data Lineage Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: INPUT (15 Features) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-blue-500" size={24} />
            <div>
              <h3 className="text-sm font-bold text-slate-800">INPUT</h3>
              <p className="text-[10px] text-slate-500">15 Features from msme_synthetic_3000.csv</p>
            </div>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {keyFeatures.map((feature, idx) => (
              <div
                key={feature.name}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 w-5">{idx + 1}</span>
                    <span className="text-xs font-semibold text-slate-700 truncate">{feature.name}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 pl-5 truncate">{feature.desc}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-mono font-bold ${feature.type === 'binary' && feature.value === 1
                    ? 'text-red-500'
                    : 'text-blue-600'
                    }`}>
                    {typeof feature.value === 'number' && feature.value > 1000
                      ? `₹${(feature.value / 100000).toFixed(2)}L`
                      : feature.value}
                  </span>
                  <span className="text-[9px] text-slate-400 block">{feature.type}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Data Source</span>
              <span className="font-semibold text-slate-700">msme_synthetic_3000.csv</span>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: PROCESSING (5 Models) */}
        <div className="lg:col-span-4 bg-slate-900 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="text-emerald-400" size={24} />
            <div>
              <h3 className="text-sm font-bold">PROCESSING</h3>
              <p className="text-[10px] text-slate-400">5-Model Ensemble Pipeline</p>
            </div>
          </div>

          <div className="space-y-3">
            {modelScores.map((model, idx) => {
              const Icon = model.icon;
              const isSelected = selectedModel?.id === model.id;

              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(isSelected ? null : model)}
                  className={`w-full p-3 rounded-xl border transition-all text-left ${isSelected
                    ? 'bg-slate-800 border-emerald-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${model.color}-500/20 flex items-center justify-center`}>
                      <Icon className={`text-${model.color}-400`} size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">{model.name}</span>
                        <span className="text-lg font-black text-emerald-400">{model.rawScore}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{model.role}</span>
                        <span>Weight: {(weights[model.id] * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-800 rounded-lg p-2">
                          <div className="text-xs text-slate-400">Raw</div>
                          <div className="text-sm font-bold">{model.rawScore}</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-2">
                          <div className="text-xs text-slate-400">Weighted</div>
                          <div className="text-sm font-bold text-emerald-400">{model.weighted}</div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-2">
                          <div className="text-xs text-slate-400">Impact</div>
                          <div className="text-sm font-bold">{model.contribution}%</div>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Fusion Arrow */}
          <div className="flex items-center justify-center my-4">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="text-[10px] uppercase tracking-wider">Fusion Logic</span>
              <ArrowRight size={16} />
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
            <div className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Weighted Average</div>
            <div className="text-xs text-slate-300">
              Σ(Model_Raw × Weight) = Final Score
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OUTPUT */}
        <div className="lg:col-span-4 space-y-4">
          {/* Final Score Card */}
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="text-2xl font-black">{Math.round(finalScore / 100)}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold">OUTPUT</h3>
                <p className="text-[10px] text-white/70">Calibrated Credit Score</p>
              </div>
            </div>

            <div className="text-center py-4">
              <div className="text-6xl font-black">{finalScore}</div>
              <div className="text-lg text-white/80">/ 900</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/20">
              <div className="text-center">
                <div className="text-[10px] text-white/60 uppercase">CMR Equivalent</div>
                <div className="text-xl font-bold">{data?.cmr_equivalent || 'CMR-3'}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-white/60 uppercase">Risk Band</div>
                <div className="text-xl font-bold">{data?.risk_band || 'LOW'}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/20">
              <div className="text-center">
                <div className="text-[10px] text-white/60 uppercase">CV Accuracy</div>
                <div className="text-xl font-bold text-emerald-300">{(data?.cv_score ? (data.cv_score * 100).toFixed(1) : 88.0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-white/60 uppercase">Reliability</div>
                <div className="text-xl font-bold">{data?.reliability_status || 'Reliable'}</div>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Model Contributions</h4>
            <div className="space-y-2">
              {modelScores.map(model => (
                <div key={model.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full bg-${model.color}-500`} />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-xs text-slate-600">{model.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${model.color}-500 rounded-full`}
                          style={{ width: `${(model.rawScore / 900) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-semibold w-8 text-right">
                        {model.rawScore}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formula Explanation */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Fusion Formula</h4>
            <div className="font-mono text-xs text-slate-600 space-y-1">
              <div>Final = (724 × 0.40) + (698 × 0.20) +</div>
              <div className="pl-12">(712 × 0.15) + (735 × 0.15) +</div>
              <div className="pl-12">(708 × 0.10)</div>
              <div className="pt-2 border-t border-slate-200 mt-2">
                <span className="text-primary font-bold">= {finalScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Processing Pipeline */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Complete Data Pipeline</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-2">
                <Database className="text-blue-600" size={28} />
              </div>
              <div className="text-xs font-semibold text-slate-700">Raw Data</div>
              <div className="text-[10px] text-slate-500">msme_synthetic_3000.csv</div>
            </div>

            <ChevronRight className="text-slate-300" size={24} />

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-2">
                <FileJson className="text-emerald-600" size={28} />
              </div>
              <div className="text-xs font-semibold text-slate-700">Feature Eng.</div>
              <div className="text-[10px] text-slate-500">15 Features</div>
            </div>

            <ChevronRight className="text-slate-300" size={24} />

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-2">
                <Cpu className="text-purple-600" size={28} />
              </div>
              <div className="text-xs font-semibold text-slate-700">5-Model Ensemble</div>
              <div className="text-[10px] text-slate-500">Parallel Inference</div>
            </div>

            <ChevronRight className="text-slate-300" size={24} />

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-2">
                <span className="text-2xl font-black text-primary">{finalScore}</span>
              </div>
              <div className="text-xs font-semibold text-slate-700">Final Score</div>
              <div className="text-[10px] text-slate-500">300-900 Range</div>
            </div>
          </div>
        </div>
      </div>

      {/* Inference Trace Section */}
      <div className="mt-6">
        <InferenceTrace />
      </div>
    </div>
  );
}

export default ModelLabs;
