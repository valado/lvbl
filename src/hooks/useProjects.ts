import { useState, useEffect, useCallback } from 'react'
import type { Project } from '@/types/database'
import type { CreateProjectInput, UpdateProjectInput } from '@/types/api'
import * as api from '@/services/api'

interface UseProjectsReturn {
  projects: Project[]
  loading: boolean
  error: string | null
  createProject: (input: CreateProjectInput) => Promise<Project>
  updateProject: (id: string, input: UpdateProjectInput) => Promise<Project>
  deleteProject: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.fetchProjects()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const createProject = useCallback(async (input: CreateProjectInput) => {
    const project = await api.createProject(input)
    await loadProjects()
    return project
  }, [loadProjects])

  const updateProject = useCallback(async (id: string, input: UpdateProjectInput) => {
    const project = await api.updateProject(id, input)
    await loadProjects()
    return project
  }, [loadProjects])

  const deleteProject = useCallback(async (id: string) => {
    await api.deleteProject(id)
    await loadProjects()
  }, [loadProjects])

  return { projects, loading, error, createProject, updateProject, deleteProject, refresh: loadProjects }
}
