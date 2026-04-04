/**
 * CredNexis Real-Time Scoring Engine
 * Implements EMA Smoothing + Hysteresis Gate + Data Envelope Cap
 */

// EMA Configuration
const ALPHA = 0.3; // 30% weight to new data, 70% to history (as per spec)
const HYSTERESIS_THRESHOLD = 3; // Reduced for spec alignment
const MAX_SWING = 25; // Slightly increased for spec reactivity
const CRITICAL_SIGNALS = ['S05', 'S06', 'S13', 'S17'];


// Score state storage per GSTIN
const scoreState = new Map();

/**
 * Calculate Exponential Moving Average (EMA)
 * score_smooth = (current_raw * alpha) + (previous_smooth * (1 - alpha))
 */
function calculateEMA(currentRaw, previousSmooth) {
  return (currentRaw * ALPHA) + (previousSmooth * (1 - ALPHA));
}

/**
 * Apply data envelope cap to limit score swings
 * Unless a CRITICAL signal is triggered
 */
function applyEnvelopeCap(previousScore, newScore, activeSignals = []) {
  const change = newScore - previousScore;
  
  // Check for critical signals
  const hasCriticalSignal = activeSignals.some(sig => 
    CRITICAL_SIGNALS.includes(sig.id)
  );
  
  // If critical signal, allow full swing
  if (hasCriticalSignal) {
    return newScore;
  }
  
  // Cap the swing to +/- MAX_SWING
  if (change > MAX_SWING) {
    return previousScore + MAX_SWING;
  } else if (change < -MAX_SWING) {
    return previousScore - MAX_SWING;
  }
  
  return newScore;
}

/**
 * Hysteresis gate - only emit if significant change
 * Returns null if change is below threshold
 */
function hysteresisGate(previousEmitted, currentScore) {
  const change = Math.abs(currentScore - previousEmitted);
  
  if (change > HYSTERESIS_THRESHOLD) {
    return currentScore;
  }
  
  return null; // Don't emit - change too small
}

/**
 * Main scoring function that processes raw score through EMA + Envelope + Hysteresis
 */
function processScore(gstin, rawScore, activeSignals = []) {
  // Initialize state if new GSTIN
  if (!scoreState.has(gstin)) {
    const initialState = {
      emaScore: rawScore, // Start EMA at first raw score
      lastEmitted: rawScore,
      history: [rawScore],
      lastUpdate: Date.now()
    };
    scoreState.set(gstin, initialState);
    return { score: rawScore, emitted: true, reason: 'initial' };
  }
  
  const state = scoreState.get(gstin);
  
  // Step 1: Apply EMA smoothing
  const emaScore = calculateEMA(rawScore, state.emaScore);
  
  // Step 2: Apply envelope cap (unless critical signal)
  const cappedScore = applyEnvelopeCap(state.emaScore, emaScore, activeSignals);
  
  // Round to integer for final score
  const finalScore = Math.round(cappedScore);
  
  // Step 3: Hysteresis gate - check if change is significant
  const emissionResult = hysteresisGate(state.lastEmitted, finalScore);
  
  // Update state
  state.emaScore = cappedScore;
  state.history.push(finalScore);
  if (state.history.length > 30) {
    state.history.shift(); // Keep last 30 points
  }
  state.lastUpdate = Date.now();
  
  // Determine if we should emit
  if (emissionResult !== null) {
    state.lastEmitted = finalScore;
    return { 
      score: finalScore, 
      emitted: true, 
      reason: 'significant_change',
      delta: finalScore - state.lastEmitted 
    };
  }
  
  return { 
    score: finalScore, 
    emitted: false, 
    reason: 'below_hysteresis',
    delta: Math.abs(finalScore - state.lastEmitted)
  };
}

/**
 * Get score history for a GSTIN
 */
function getScoreHistory(gstin) {
  const state = scoreState.get(gstin);
  if (!state) return [];
  return state.history;
}

/**
 * Get current smoothed score without triggering emission
 */
function getCurrentScore(gstin) {
  const state = scoreState.get(gstin);
  if (!state) return null;
  return Math.round(state.emaScore);
}

/**
 * Reset state for a GSTIN (e.g., on logout)
 */
function resetScoreState(gstin) {
  scoreState.delete(gstin);
}

/**
 * Generate mock raw score for demo purposes
 * Simulates realistic volatility
 */
function generateMockRawScore(baseScore = 650) {
  // Add realistic noise (normally distributed)
  const noise = (Math.random() - 0.5) * 40; // +/- 20 points jitter
  const trend = Math.sin(Date.now() / 10000) * 10; // Slow cyclical trend
  
  return Math.max(300, Math.min(900, baseScore + noise + trend));
}

/**
 * Check if score state is stale (no update for > 5 minutes)
 */
function isStale(gstin) {
  const state = scoreState.get(gstin);
  if (!state) return true;
  
  const fiveMinutes = 5 * 60 * 1000;
  return (Date.now() - state.lastUpdate) > fiveMinutes;
}

module.exports = {
  processScore,
  getScoreHistory,
  getCurrentScore,
  resetScoreState,
  generateMockRawScore,
  isStale,
  // Constants for reference
  ALPHA,
  HYSTERESIS_THRESHOLD,
  MAX_SWING,
  CRITICAL_SIGNALS
};
