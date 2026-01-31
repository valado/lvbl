export type TaskStatus = 'pending' | 'ready' | 'generating' | 'completed' | 'failed' | 'cancelled'

export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent'

export type PlatformType = 'telegram' | 'slack' | 'dashboard'

export type TaskType = 'new_project' | 'existing_project'

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  telegram_id: number | null
  slack_user_id: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  owner_id: string
  name: string
  lovable_url: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  owner_id: string
  project_id: string | null
  task_type: TaskType
  status: TaskStatus
  priority: TaskPriority
  title: string
  prompt: string
  image_urls: string[]
  scheduled_at: string | null
  executed_at: string | null
  lovable_url: string | null
  error_message: string | null
  source_platform: PlatformType
  source_chat_id: string | null
  source_message_id: string | null
  created_at: string
  updated_at: string
  project?: Project | null
}

export interface TaskLog {
  id: string
  task_id: string
  action: string
  details: Record<string, unknown>
  created_at: string
}

export interface PlatformConnection {
  id: string
  profile_id: string
  platform: PlatformType
  platform_user_id: string
  platform_data: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total_tasks: number
  pending_tasks: number
  completed_today: number
  failed_tasks: number
}
