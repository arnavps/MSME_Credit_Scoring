// hooks/useScore.js
import { useState, useCallback } from 'react'
import { fetchCreditScore, getMockScore } from '../services/api'

export function useScore() {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
    phase: 'idle', // idle | fetching | processing | done | error
  })

  const score = useCallback(async (gstin) => {
    setState({ data: null, loading: true, error: null, phase: 'fetching' })

    // Simulate processing phases for UX
    const phaseTimer = setTimeout(() => {
      setState(s => ({ ...s, phase: 'processing' }))
    }, 800)

    try {
      let data
      try {
        data = await fetchCreditScore(gstin)
      } catch {
        // Fallback to mock data when API isn't available
        await new Promise(r => setTimeout(r, 1600))
        data = getMockScore(gstin)
      }

      clearTimeout(phaseTimer)
      setState({ data, loading: false, error: null, phase: 'done' })
    } catch (err) {
      clearTimeout(phaseTimer)
      setState({
        data: null,
        loading: false,
        error: err.message || 'Failed to generate score. Please try again.',
        phase: 'error',
      })
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null, phase: 'idle' })
  }, [])

  return { ...state, score, reset }
}
