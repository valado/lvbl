import { supabase } from '@/config/supabase'
import type { Task, Project, TaskLog, DashboardStats } from '@/types/database'
import type {
  CreateTaskInput,
  UpdateTaskInput,
  CreateProjectInput,
  UpdateProjectInput,
  TaskFilters,
  PaginationParams,
  PaginatedResponse,
} from '@/types/api'

// ── Tasks ─────────────────────────────────────────────────────

export async function fetchTasks(
  filters: TaskFilters = {},
  pagination: PaginationParams = { page: 0, page_size: 25 },
): Promise<PaginatedResponse<Task>> {
  let query = supabase
    .from('tasks')
    .select('*, project:projects(*)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.priority) {
    query = query.eq('priority', filters.priority)
  }
  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`)
  }
  if (filters.date_from) {
    query = query.gte('created_at', filters.date_from)
  }
  if (filters.date_to) {
    query = query.lte('created_at', filters.date_to)
  }

  const from = pagination.page * pagination.page_size
  const to = from + pagination.page_size - 1
  query = query.range(from, to)

  const { data, count, error } = await query
  if (error) throw error
  return { data: (data ?? []) as Task[], count: count ?? 0 }
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...input,
      source_platform: 'dashboard',
    })
    .select('*, project:projects(*)')
    .single()

  if (error) throw error
  return data as Task
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(input)
    .eq('id', id)
    .select('*, project:projects(*)')
    .single()

  if (error) throw error
  return data as Task
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}

export async function executeTask(id: string): Promise<Task> {
  return updateTask(id, { status: 'ready' })
}

// ── Task Logs ───────────────────────────────────────────────────

export async function fetchTaskLogs(taskId: string): Promise<TaskLog[]> {
  const { data, error } = await supabase
    .from('task_logs')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as TaskLog[]
}

// ── Projects ────────────────────────────────────────────────────

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Project[]
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data as Project
}

export async function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Project
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

// ── Stats ───────────────────────────────────────────────────────

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data, error } = await supabase
    .from('dashboard_stats')
    .select('*')
    .single()

  if (error) throw error
  return data as DashboardStats
}
