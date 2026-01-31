import { useState, useEffect, useCallback } from 'react'
import type { DashboardStats } from '@/types/database'
import { fetchDashboardStats } from '@/services/api'

interface UseTaskStatsReturn {
  stats: DashboardStats | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useTaskStats(): UseTaskStatsReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchDashboardStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return { stats, loading, error, refresh: loadStats }
}
