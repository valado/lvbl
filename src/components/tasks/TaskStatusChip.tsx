import { Chip } from '@mui/material'
import type { TaskStatus } from '@/types/database'

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
  pending: { label: 'Pending', color: 'default' },
  ready: { label: 'Ready', color: 'info' },
  generating: { label: 'Generating', color: 'warning' },
  completed: { label: 'Completed', color: 'success' },
  failed: { label: 'Failed', color: 'error' },
  cancelled: { label: 'Cancelled', color: 'default' },
}

interface TaskStatusChipProps {
  status: TaskStatus
}

export function TaskStatusChip({ status }: TaskStatusChipProps) {
  const config = STATUS_CONFIG[status]
  return <Chip label={config.label} color={config.color} size="small" variant="outlined" />
}
