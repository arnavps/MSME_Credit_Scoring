import React, { useMemo } from 'react';
import { Loader2, RefreshCw, WifiOff } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import AmnestyForensicPanel from './AmnestyForensicPanel';
import { API_BASE_URL } from '../config/api';

/**
 * Resolves infinite "Decrypting..." when /amnesty-preview fails (API down).
 * Uses last successful /risk payload as fallback when available.
 */
export default function AmnestyForensicTraceCard() {
  const {
    data,
    amnestyPreview,
    amnestyPreviewLoading,
    amnestyPreviewError,
    fetchAmnestyPreview,
    activeGstin,
    riskDataSynced,
  } = useDashboard();

  const fallbackPreview = useMemo(() => {
    if (!riskDataSynced || data?.credit_score == null) return null;
    const boost = data.amnesty_info?.boost ?? 0;
    return {
      baseline_score: data.credit_score - boost,
      amnesty_score: data.credit_score,
      boost,
      is_eligible: !!data.amnesty_info?.applied,
      neutralized_factors: data.amnesty_info?.applied
        ? ['avg_days_late', 'filing_compliance_rate']
        : [],
    };
  }, [riskDataSynced, data]);

  if (amnestyPreviewLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[12rem] bg-slate-900 rounded-[32px] border border-white/5 p-8 text-white">
        <Loader2 className="animate-spin text-emerald-400 mb-4" size={32} />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Decrypting Forensic Trace...
        </span>
      </div>
    );
  }

  if (amnestyPreview) {
    return <AmnestyForensicPanel previewData={amnestyPreview} />;
  }

  if (fallbackPreview) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[10px] font-bold text-amber-200/90 uppercase tracking-widest">
          Comparison preview unavailable — showing scores from your last risk sync (start FastAPI for live A/B).
        </div>
        <AmnestyForensicPanel previewData={fallbackPreview} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-[12rem] bg-slate-900 rounded-[32px] border border-white/5 p-8 text-white text-center">
      <WifiOff className="text-amber-400/80" size={28} />
      <div>
        <p className="text-sm font-bold text-slate-200 mb-1">Forensic trace could not load</p>
        <p className="text-[11px] text-slate-500 max-w-sm">
          {amnestyPreviewError || 'Credit API unreachable.'} Sync a GSTIN first, then ensure the backend is running at{' '}
          <span className="text-slate-400 font-mono">{API_BASE_URL}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={() => activeGstin && fetchAmnestyPreview(activeGstin)}
        disabled={!activeGstin}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-40"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}
