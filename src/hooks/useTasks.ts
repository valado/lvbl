import { useState, useEffect, useCallback } from 'react'
import type { Task } from '@/types/database'
import type { TaskFilters, PaginationParams, CreateTaskInput, UpdateTaskInput } from '@/types/api'
import * as api from '@/services/api'

interface UseTasksReturn {
  tasks: Task[]
  totalCount: number
  loading: boolean
  error: string | null
  filters: TaskFilters
  pagination: PaginationParams
  setFilters: (filters: TaskFilters) => void
  setPagination: (pagination: PaginationParams) => void
  createTask: (input: CreateTaskInput) => Promise<Task>
  updateTask: (id: string, input: UpdateTaskInput) => Promise<Task>
  deleteTask: (id: string) => Promise<void>
  executeTask: (id: string) => Promise<Task>
  refresh: () => Promise<void>
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TaskFilters>({})
  const [pagination, setPagination] = useState<PaginationParams>({ page: 0, page_size: 25 })

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.fetchTasks(filters, pagination)
      setTasks(result.data)
      setTotalCount(result.count)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [filters, pagination])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const createTask = useCallback(async (input: CreateTaskInput) => {
    const task = await api.createTask(input)
    await loadTasks()
    return task
  }, [loadTasks])

  const updateTask = useCallback(async (id: string, input: UpdateTaskInput) => {
    const task = await api.updateTask(id, input)
    await loadTasks()
    return task
  }, [loadTasks])

  const deleteTask = useCallback(async (id: string) => {
    await api.deleteTask(id)
    await loadTasks()
  }, [loadTasks])

  const executeTask = useCallback(async (id: string) => {
    const task = await api.executeTask(id)
    await loadTasks()
    return task
  }, [loadTasks])

  return {
    tasks,
    totalCount,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    setPagination,
    createTask,
    updateTask,
    deleteTask,
    executeTask,
    refresh: loadTasks,
  }
}
