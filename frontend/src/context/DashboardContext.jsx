import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

const DashboardContext = createContext();

const SOCKET_URL = 'http://localhost:5000';
const CACHE_DURATION = 300000;

// Hardcoded stable values for UI testing - Unified Node v3.0 (Synchronized)
const STABLE_DATA = {
  credit_score: 630,
  balance: 689372.00,
  risk_band: 'Low-Medium Risk',
  fraudAnalysis: {
    circularNodes: [], // Source of truth for all fraud counts
    intensity: 0,
    status: 'Nominal'
  },
  recommendation: {
    amount: 1850000,
    tenure: 18,
    rate: 11.5
  },
  top_5_reasons: {
    positive: [
      "Stable monthly transaction velocity (+)",
      "Low EMI-to-Income ratio observed (+)",
      "High buyer retention (85%) (+)",
      "No circular transactions detected (+)"
    ],
    negative: [
      "Recent 15% dip in GST filing cadence (-)",
      "Observed cheque bounce in previous quarter (-)"
    ]
  },
  advisory: {
    bankers_verdict: "The MSME demonstrates professional cash-flow management with a resilient buyer network.",
    risk_context: "PRIMARY RISK STEMS FROM A TRANSIENT LIQUIDITY TIGHTENING OBSERVED IN GST RECORDS.",
    thirty_day_fix: [
      "Standardize GST filing date to before 10th",
      "Resolve the pending ₹42,000 tax arrear",
      "Increase POS transaction volume by 10%"
    ]
  },
  cv_score: 0.88,
  reliability_status: "Reliable",
  timestamp: new Date().toISOString()
};


export const DashboardProvider = ({ children }) => {
  const [data, setData] = useState(STABLE_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeGstin, setActiveGstin] = useState(null);
  const [pendingGstin, setPendingGstin] = useState(null);

  // Live Streaming State (from Node server)
  const [liveData, setLiveData] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef(null);
  const abortControllerRef = useRef(null);

  const [riskDataSynced, setRiskDataSynced] = useState(false);
  const [amnestyPreview, setAmnestyPreview] = useState(null);
  const [amnestyPreviewLoading, setAmnestyPreviewLoading] = useState(false);
  const [amnestyPreviewError, setAmnestyPreviewError] = useState(null);

  // Connect to Streaming Server
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to Streaming Bus');
    });

    socketRef.current.on('update', (payload) => {
      // Only update live metrics if it's for the currently x-rayed merchant
      // If no gstin in payload, assume it's for the demo_gstin
      const payloadGstin = payload.gstin || '27AAPFU0939F1ZV';

      if (payloadGstin === activeGstin) {
        setLiveData(payload);
        setScoreHistory(prev => [...prev.slice(-29), {
          timestamp: payload.timestamp,
          score: payload.score
        }]);
      }

      // Real-time Signal Processor (ICU Protocol v3)
      const newAlerts = [];
      const features = payload?.features;

      if (features) {
        if (features.net_inflow_ratio < -0.1) {
          newAlerts.push({ id: 'S08', text: 'Critical: Negative cash flow ratio detected', severity: 'HIGH' });
        } else if (features.net_inflow_ratio < 0.1) {
          newAlerts.push({ id: 'S08', text: 'Warning: Cash flow tightening observed', severity: 'MEDIUM' });
        }

        if (features.invoice_velocity > 10) {
          newAlerts.push({ id: 'S11', text: 'Alert: Unusual Invoice Velocity spike', severity: 'LOW' });
        }

        if (features.txn_density < 0.2) {
          newAlerts.push({ id: 'S02', text: 'GST Logic: Dormant transaction activity', severity: 'MEDIUM' });
        }
      }

      if (newAlerts.length > 0) {
        setAlerts(prev => {
          // Flatten into text for basic UI, or keep as objects for advanced UI
          const mapped = newAlerts.map(a => `${a.id}: ${a.text}`);
          return [...mapped, ...prev].slice(0, 10);
        });
      }
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // 5-Minute Stability Lock
  const [isLocked, setIsLocked] = useState(false);
  const lastUpdatedRef = useRef(0);


  // Ingress Stream Stability (Mapped to GSTIN data)
  const [streamVelocities, setStreamVelocities] = useState({
    upi: 12,
    pos: 8,
    gst: 4,
    eway: 2
  });


  const toggleStream = useCallback(() => {
    console.log("Stream control disabled in Unified Mode.");
  }, []);

  // Fetch data with AbortController & Locking
  const fetchScoreData = useCallback(async (gstin, forceAuth = false, bypassLock = false) => {
    if (!gstin) return;

    // GSTIN Cache Buster: If GSTIN changes, abort previous and reset lock
    if (activeGstin !== gstin) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      bypassLock = true;
      setIsLocked(false);
      lastUpdatedRef.current = 0;
      // Reset data during fresh search to avoid confusion
      setData(null);
    }

    setActiveGstin(gstin);

    // 2. Fresh Data Fetch: Disabled Stability Lock for demo visibility
    const now = Date.now();
    // if (!bypassLock && isLocked && (now - lastUpdatedRef.current < CACHE_DURATION)) {
    //   toast.info('Stability Lock Active - Displaying cached state');
    //   setView('dashboard');
    //   return;
    // }

    if (!isAuthenticated && !forceAuth) {
      setPendingGstin(gstin);
      setView('login');
      return;
    }

    // Initialize new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/risk/${gstin}`, {
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const detail = errorBody.detail;
        const msg = (typeof detail === 'object') ? (detail.message || JSON.stringify(detail)) : (detail || 'System Handoff Failure');
        throw new Error(msg);
      }

      const jsonData = await response.json();

      // DEBUG: Log API response
      console.log('[CredNexis] API Response for GSTIN:', gstin, jsonData);

      // Map new API response to unified data structure
      setData({
        credit_score: jsonData.credit_score,
        risk_band: jsonData.risk_band,
        recommendation: jsonData.recommendation,
        top_5_reasons: jsonData.top_5_reasons,
        advisory: jsonData.advisory,
        shap: jsonData.shap,
        is_heuristic: jsonData.advisory?.is_heuristic || false,
        fraudAnalysis: jsonData.fraud_analysis,
        amnesty_info: jsonData.amnesty_info,
        model_trace: jsonData.model_trace,
        cv_score: jsonData.cv_score,
        model_accuracy: jsonData.model_accuracy,
        reliability_status: jsonData.reliability_status,
        timestamp: jsonData.timestamp
      });
      setRiskDataSynced(true);


      // Update stream velocities from top-level field
      if (jsonData.stream_velocities) {
        setStreamVelocities(jsonData.stream_velocities);
      }

      // Update lock state
      const updateTime = Date.now();
      lastUpdatedRef.current = updateTime;
      setIsLocked(true);

      setView('dashboard');
    } catch (err) {
      if (err.name === 'AbortError') return;

      let msg = err.message;
      try {
        // Attempt to parse structured error from backend
        if (err.response) {
          const errorJson = await err.response.json();
          msg = errorJson.detail?.message || errorJson.detail || msg;
        }
      } catch (e) { }

      setError(msg);
      setRiskDataSynced(false);
      // Keep view as dashboard so error can be shown in context
      setView('dashboard');
    } finally {
      if (abortControllerRef.current?.signal.aborted) return;
      setLoading(false);
    }

  }, [isAuthenticated, activeGstin, isLocked]);

  // Observer for GSTIN Input Field changes (Immediate Reset)
  useEffect(() => {
    if (activeGstin && view === 'landing') {
      fetchScoreData(activeGstin, true, true);
    }
  }, [activeGstin, view]);

  const login = useCallback((credentials) => {
    setIsAuthenticated(true);
    const gstin = credentials?.gstin || pendingGstin;
    if (gstin) {
      setActiveGstin(gstin);
      setPendingGstin(null);
    } else {
      setView('dashboard');
    }
  }, [pendingGstin]);

  const resetView = useCallback(() => {
    setView('landing');
    setData(STABLE_DATA);
    setIsLocked(false);
    lastUpdatedRef.current = 0;
    setActiveGstin(null);
    setRiskDataSynced(false);
  }, []);

  // Derived Fraud Boolean (Single Source of Truth)
  const isFraudDetected = (data?.fraudAnalysis?.circularNodes?.length || 0) > 0;

  useEffect(() => {
    setAmnestyPreview(null);
    setAmnestyPreviewError(null);
    setAmnestyPreviewLoading(false);
  }, [activeGstin]);

  const fetchAmnestyPreview = useCallback(async (gstin) => {
    if (!gstin) return;
    setAmnestyPreviewLoading(true);
    setAmnestyPreviewError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/risk/${gstin}/amnesty-preview`);
      if (!response.ok) {
        const hint = response.status === 404 ? 'GSTIN not in dataset' : `HTTP ${response.status}`;
        throw new Error(hint);
      }
      const jsonData = await response.json();
      setAmnestyPreview(jsonData);
    } catch (err) {
      setAmnestyPreview(null);
      const msg = err?.message || 'Network error — is FastAPI on port 8001?';
      setAmnestyPreviewError(msg);
      console.warn(
        `[CredNexis] Amnesty preview failed: ${msg}. Start API: python -m uvicorn api.main:app --reload --port 8001 (${API_BASE_URL})`
      );
    } finally {
      setAmnestyPreviewLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider value={{
      data,
      loading,
      error,
      view,
      setView,
      isAuthenticated,
      login,
      fetchScoreData,
      fetchAmnestyPreview,
      amnestyPreview,
      amnestyPreviewLoading,
      amnestyPreviewError,
      riskDataSynced,
      resetView,
      activeGstin,
      isConnected,
      isLocked,
      lastUpdated: lastUpdatedRef.current,
      scoreHistory,
      liveData,
      alerts,
      toggleStream,
      isFraudDetected,
      streamVelocities,
      isStableMode: true,
      isHeuristic: data?.is_heuristic || false
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
