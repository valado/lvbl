import { useState, useEffect, useCallback } from 'react'
import type { TaskLog } from '@/types/database'
import { fetchTaskLogs } from '@/services/api'

interface UseTaskLogsReturn {
  logs: TaskLog[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useTaskLogs(taskId: string | null): UseTaskLogsReturn {
  const [logs, setLogs] = useState<TaskLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadLogs = useCallback(async () => {
    if (!taskId) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTaskLogs(taskId)
      setLogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load logs')
    } finally {
      setLoading(false)
    }
  }, [taskId])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  return { logs, loading, error, refresh: loadLogs }
}
