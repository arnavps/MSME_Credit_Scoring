// services/api.js — CredNexis API integration layer

const API_BASE = import.meta.env.VITE_API_URL || ''

/**
 * POST /score
 * @param {string} gstin - 15-character GST Identification Number
 * @returns {Promise<ScoreResponse>}
 */
export async function fetchCreditScore(gstin) {
  const response = await fetch(`${API_BASE}/score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ gstin }),
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new APIError(
      err.detail || `Server error: ${response.status}`,
      response.status
    )
  }

  return response.json()
}

export class APIError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.name = 'APIError'
    this.statusCode = statusCode
  }
}

// ─── Mock data generator (used as fallback when API is unreachable) ─────────

export function getMockScore(gstin) {
  const seed = gstin.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const rng = (min, max) => min + (seed % (max - min + 1))

  const score = Math.min(900, Math.max(300, rng(480, 860)))
  const fraudFlag = gstin.includes('9Z6') || gstin.includes('FRAUD')

  const months = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']
  const upiTrend = months.map((m, i) => ({
    month: m,
    volume: Math.round(1.8 + Math.sin(i * 0.6) * 0.9 + i * 0.12 + (seed % 8) * 0.15),
    count: Math.round(420 + Math.sin(i * 0.5) * 80 + i * 18),
  }))
  const gstTrend = months.map((m, i) => ({
    month: m,
    taxable: Math.round(24 + Math.cos(i * 0.4) * 8 + i * 1.2 + (seed % 6)),
    tax: Math.round(4.3 + Math.cos(i * 0.4) * 1.4 + i * 0.2),
  }))

  const eligibleAmt = score > 750 ? 4500000 : score > 620 ? 2200000 : score > 480 ? 800000 : 250000
  const tenure = score > 750 ? 36 : score > 620 ? 24 : 12
  const rate = score > 750 ? 10.5 : score > 620 ? 13.2 : score > 480 ? 16.8 : 21.5
  const emi = Math.round((eligibleAmt * (rate / 1200)) / (1 - Math.pow(1 + rate / 1200, -tenure)))

  return {
    gstin,
    entity: {
      name: 'M/S Urban Craft Private Limited',
      type: 'Private Limited',
      state: 'Maharashtra',
      district: 'Pune',
      pan: gstin.substring(2, 12),
      vintage_years: 6,
      employee_count: 42,
      annual_turnover: 28500000,
      sector: 'Manufacturing',
      last_filed: '2025-03-20',
      gst_status: 'Active',
    },
    credit_score: score,
    risk_band: score > 750 ? 'LOW' : score > 600 ? 'MEDIUM' : 'HIGH',
    fraud_flag: fraudFlag,
    fraud_reasons: fraudFlag
      ? ['Suspicious transaction pattern detected', 'Address mismatch with MCA records', 'Multiple entities at same address']
      : [],
    loan_recommendation: {
      eligible_amount: eligibleAmt,
      tenure_months: tenure,
      interest_rate: rate,
      emi,
      product_type: score > 700 ? 'Term Loan' : 'Working Capital',
      collateral_required: score < 600,
    },
    explainability: {
      reasons: [
        { rank: 1, factor: 'GST Filing Regularity', description: 'Consistent GST filing for 24 consecutive months with zero defaults or late penalties.', impact: 'positive', weight: 0.87 },
        { rank: 2, factor: 'UPI Transaction Growth', description: 'Digital payment volumes show 18% year-over-year growth, indicating business expansion.', impact: 'positive', weight: 0.72 },
        { rank: 3, factor: 'Credit Utilization', description: 'Current credit utilization of 34% is well within healthy thresholds (<60%).', impact: 'positive', weight: 0.65 },
        { rank: 4, factor: 'Supplier Payment Cycle', description: 'Average payable cycle of 12 days reflects strong working capital management.', impact: 'positive', weight: 0.58 },
        { rank: 5, factor: 'Business Vintage', description: '6+ years of operational history reduces uncertainty in repayment projections.', impact: 'positive', weight: 0.44 },
      ],
      feature_importance: [
        { feature: 'GST Compliance', importance: 0.87, category: 'compliance' },
        { feature: 'UPI Activity', importance: 0.72, category: 'cashflow' },
        { feature: 'Credit History', importance: 0.65, category: 'credit' },
        { feature: 'Revenue Growth', importance: 0.58, category: 'financials' },
        { feature: 'Business Vintage', importance: 0.44, category: 'stability' },
        { feature: 'Sector Risk', importance: 0.31, category: 'external' },
      ],
    },
    trends: {
      upi: upiTrend,
      gst: gstTrend,
    },
    model_version: 'crednexis-v2.4.1',
    scored_at: new Date().toISOString(),
    confidence: Math.round(82 + (score % 12)),
  }
}
