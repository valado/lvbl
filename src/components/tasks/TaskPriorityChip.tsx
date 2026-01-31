import { Chip } from '@mui/material'
import type { TaskPriority } from '@/types/database'

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
  low: { label: 'Low', color: 'default' },
  normal: { label: 'Normal', color: 'primary' },
  high: { label: 'High', color: 'warning' },
  urgent: { label: 'Urgent', color: 'error' },
}

interface TaskPriorityChipProps {
  priority: TaskPriority
}

export function TaskPriorityChip({ priority }: TaskPriorityChipProps) {
  const config = PRIORITY_CONFIG[priority]
  return <Chip label={config.label} color={config.color} size="small" />
}
