/**
 * CredNexis Rolling Feature Engine
 * Maintains an in-memory sliding window of the last 30 minutes.
 * Produces the Core 5 features required by the Hackathon spec.
 */

const WINDOW_MS = 30 * 60 * 1000; // 30 minutes

let state = {
  inflow: [],
  outflow: [],
  invoices: [],
  eway: []
};

function update(event) {
  const now = Date.now();
  
  if (event.type === 'txn') {
    (event.dir === 'in' ? state.inflow : state.outflow).push(event);
  } else if (event.type === 'invoice') {
    state.invoices.push(event);
  } else if (event.type === 'eway') {
    state.eway.push(event);
  }

  // Prune old events outside the 30-minute window
  for (const key of Object.keys(state)) {
    state[key] = state[key].filter(e => now - e.ts <= WINDOW_MS);
  }
}

function compute() {
  const inflowTransactions = state.inflow;
  const outflowTransactions = state.outflow;

  const inflowSum = inflowTransactions.reduce((acc, curr) => acc + curr.amt, 0);
  const outflowSum = outflowTransactions.reduce((acc, curr) => acc + curr.amt, 0);

  // Variance calculation for cash flow stability
  const inflowAmounts = inflowTransactions.map(t => t.amt);
  const mean = inflowAmounts.length ? inflowSum / inflowAmounts.length : 0;
  const variance = inflowAmounts.length 
    ? inflowAmounts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / inflowAmounts.length
    : 0;

  const mins = WINDOW_MS / 60000; // 30 minutes

  return {
    net_inflow_ratio: inflowSum ? (inflowSum - outflowSum) / inflowSum : 0,
    cash_flow_stability: variance, // Lower is more stable (positive signal)
    invoice_velocity: state.invoices.length / mins, // Invoices per minute
    eway_trend: state.eway.length, // Count of bills in window
    txn_density: (inflowTransactions.length + outflowTransactions.length) / mins // Frequency
  };
}

module.exports = { update, compute };
