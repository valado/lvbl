import type { TaskStatus, TaskPriority, TaskType } from './database'

export interface CreateTaskInput {
  title: string
  prompt: string
  task_type: TaskType
  project_id?: string | null
  priority: TaskPriority
  image_urls?: string[]
  scheduled_at?: string | null
}

export interface UpdateTaskInput {
  title?: string
  prompt?: string
  priority?: TaskPriority
  scheduled_at?: string | null
  status?: TaskStatus
}

export interface CreateProjectInput {
  name: string
  lovable_url: string
  description?: string | null
}

export interface UpdateProjectInput {
  name?: string
  lovable_url?: string
  description?: string | null
}

export interface TaskFilters {
  status?: TaskStatus | null
  priority?: TaskPriority | null
  search?: string
  date_from?: string | null
  date_to?: string | null
}

export interface PaginationParams {
  page: number
  page_size: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
}

export interface AuthCredentials {
  email: string
  password: string
}
