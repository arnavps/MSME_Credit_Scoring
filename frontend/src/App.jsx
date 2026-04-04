import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

// Context
import { DashboardProvider } from './context/DashboardContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Dashboard Components
import Sidebar from './components/Sidebar';
import CommandHeader from './components/CommandHeader';
import IntelligencePulse from './components/IntelligencePulse';
import LenderArena from './components/LenderArena';
import RiskDecompositionCard from './components/RiskDecompositionCard';
import ExplainabilityGrid from './components/ExplainabilityGrid';
import FeatureSparks from './components/FeatureSparks';
import SentinelDetail from './components/SentinelDetail';
import NetworkDeepDive from './components/NetworkDeepDive';
import PulseView from './components/PulseView';
import ArenaView from './components/ArenaView';
import ModelLabs from './components/ModelLabs';
import ModelEnsembleVisualizer from './components/ModelEnsembleVisualizer';

// Dashboard Layout Shell
function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-inter selection:bg-primary selection:text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col pl-20 min-w-0 transition-all duration-500">
        {/* TOP COMMAND BAR */}
        <div className="flex items-center justify-between px-8 py-4 bg-white/50 backdrop-blur-sm border-b border-white/20">
          <CommandHeader />
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-connection relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Network: Nominal
              </span>
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// Unified Overview (Dashboard Index)
function UnifiedOverview() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SECTION A1: PULSE // CREDIT X-RAY (Col 4) */}
        <div className="lg:col-span-4 h-[560px]">
          <IntelligencePulse />
        </div>

        {/* SECTION A2: ARENA // MARKETPLACE (Col 4) */}
        <div className="lg:col-span-4 h-[560px]">
          <LenderArena />
        </div>

        {/* SECTION A3: SENTINEL // RISK DECOMPOSITION (Col 4) */}
        <div className="lg:col-span-4 h-[560px]">
          <RiskDecompositionCard />
        </div>

        {/* SECTION B1-B3: INTEGRATED INTELLIGENCE (Col 12) */}
        <div className="lg:col-span-12">
          <ExplainabilityGrid />
        </div>
      </div>

      {/* Unified Footer */}
      <footer className="mt-8 py-8 border-t border-slate-200/50 flex items-center justify-between opacity-50">
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">
          Integrated Credit Underwriting Protocol // v3.0 // 2024
        </span>
        <div className="flex items-center gap-6">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">
            Node: BFS-SYD-01
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">
            Latency: 14ms
          </span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DashboardProvider>
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* DASHBOARD ROUTES */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<UnifiedOverview />} />
            <Route path="pulse" element={<PulseView />} />
            <Route path="arena" element={<ArenaView />} />
            <Route path="sentinel" element={<SentinelDetail />} />
            <Route path="network" element={<NetworkDeepDive />} />
            <Route path="model-labs" element={<ModelLabs />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;
