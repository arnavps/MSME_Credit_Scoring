// pages/Dashboard.jsx
import { AnimatePresence, motion } from 'framer-motion'
import InputPanel from '../components/InputPanel'
import ScoreCard from '../components/ScoreCard'
import LoanRecommendation from '../components/LoanRecommendation'
import ExplainabilitySection from '../components/ExplainabilitySection'
import FraudAlert from '../components/FraudAlert'
import ChartsSection from '../components/ChartsSection'
import EntityProfile from '../components/EntityProfile'
import EmptyState from '../components/EmptyState'
import LoadingSkeleton from '../components/LoadingSkeleton'
import SidebarSkeleton from '../components/SidebarSkeleton'
import { useScore } from '../hooks/useScore'

export default function Dashboard() {
  const { data, loading, error, phase, score, reset } = useScore()

  const handleSubmit = (gstin) => {
    score(gstin)
  }

  return (
    <div className="flex h-[calc(100vh-61px)] overflow-hidden">
      {/* ── LEFT SIDEBAR ──────────────────────────────────────────── */}
      <aside
        className="w-[340px] flex-shrink-0 flex flex-col overflow-y-auto"
        style={{ borderRight: '0.5px solid rgba(255,255,255,0.07)' }}
      >
        <div className="p-5 flex flex-col gap-5">
          {/* Input panel always visible */}
          <InputPanel
            onSubmit={handleSubmit}
            loading={loading}
            phase={phase}
          />

          {/* Error state */}
          <AnimatePresence>
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-xl p-4 text-sm flex items-start gap-3"
                style={{ background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.2)', color: '#f87171' }}
              >
                <span className="text-base">⚠</span>
                <div>
                  <div className="font-medium text-xs mb-1">Request Failed</div>
                  <div className="text-[11px] leading-relaxed opacity-80">{error}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sidebar results */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="sidebar-loading" exit={{ opacity: 0 }}>
                <SidebarSkeleton />
              </motion.div>
            )}
            {data && !loading && (
              <motion.div
                key="sidebar-data"
                className="flex flex-col gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ScoreCard data={data} />
                <LoanRecommendation data={data} />
                <EntityProfile data={data} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-5 min-h-full">
          <AnimatePresence mode="wait">
            {/* Idle / empty */}
            {phase === 'idle' && !data && (
              <motion.div key="empty" className="h-full" exit={{ opacity: 0 }}>
                <EmptyState />
              </motion.div>
            )}

            {/* Loading */}
            {loading && (
              <motion.div key="loading" exit={{ opacity: 0 }}>
                <LoadingSkeleton />
              </motion.div>
            )}

            {/* Error without data */}
            {phase === 'error' && !data && (
              <motion.div
                key="error"
                className="flex flex-col items-center justify-center h-full py-20 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-4xl mb-4">⚡</div>
                <div className="text-base font-medium mb-2">Unable to fetch score</div>
                <div className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                  {error || 'An unexpected error occurred. Please try again.'}
                </div>
                <button
                  onClick={reset}
                  className="mt-5 px-4 py-2 text-xs rounded-xl transition-all"
                  style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent-2)', border: '0.5px solid rgba(59,130,246,0.2)' }}
                >
                  Try again
                </button>
              </motion.div>
            )}

            {/* Results */}
            {data && !loading && (
              <motion.div
                key="results"
                className="flex flex-col gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Top action bar */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-base font-semibold tracking-tight">
                      Credit Analysis Report
                    </h1>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                      {data.entity.name} · {data.gstin}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-2)', border: '0.5px solid rgba(255,255,255,0.08)' }}
                    >
                      ↓ Export PDF
                    </button>
                    <button
                      onClick={reset}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-2)', border: '0.5px solid rgba(255,255,255,0.08)' }}
                    >
                      ✕ Clear
                    </button>
                  </div>
                </div>

                {/* Fraud alert — prominent if present */}
                <FraudAlert data={data} />

                {/* Explainability */}
                <ExplainabilitySection data={data} />

                {/* Charts */}
                <ChartsSection data={data} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
