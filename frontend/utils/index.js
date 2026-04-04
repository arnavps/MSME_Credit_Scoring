// utils/index.js

export function formatCurrency(amount, compact = false) {
  if (compact) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(iso) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(iso))
}

export function getBandConfig(band) {
  const configs = {
    LOW: {
      label: 'Low Risk',
      color: '#22c55e',
      bg: 'rgba(34,197,94,0.1)',
      border: 'rgba(34,197,94,0.25)',
      ring: '#22c55e',
      glow: 'rgba(34,197,94,0.2)',
      tailwind: 'text-green-400 bg-green-500/10 border-green-500/25',
    },
    MEDIUM: {
      label: 'Medium Risk',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
      border: 'rgba(245,158,11,0.25)',
      ring: '#f59e0b',
      glow: 'rgba(245,158,11,0.2)',
      tailwind: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    },
    HIGH: {
      label: 'High Risk',
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.1)',
      border: 'rgba(239,68,68,0.25)',
      ring: '#ef4444',
      glow: 'rgba(239,68,68,0.2)',
      tailwind: 'text-red-400 bg-red-500/10 border-red-500/25',
    },
  }
  return configs[band] || configs.MEDIUM
}

export function getScoreProgress(score) {
  return ((score - 300) / 600) * 100
}

export function validateGSTIN(gstin) {
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
  return regex.test(gstin.toUpperCase())
}

export function getCategoryColor(category) {
  const map = {
    compliance: '#3b82f6',
    cashflow:   '#22c55e',
    credit:     '#a78bfa',
    financials: '#f59e0b',
    stability:  '#06b6d4',
    external:   '#f97316',
  }
  return map[category] || '#8892a8'
}

export function clsx(...classes) {
  return classes.filter(Boolean).join(' ')
}
