import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Card,
  CardContent,
  Skeleton,
} from '@mui/material'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Task } from '@/types/database'
import { TaskStatusChip } from '@/components/tasks/TaskStatusChip'
import { TaskPriorityChip } from '@/components/tasks/TaskPriorityChip'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

dayjs.extend(relativeTime)

interface RecentTasksListProps {
  tasks: Task[]
  loading: boolean
}

export function RecentTasksList({ tasks, loading }: RecentTasksListProps) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recent Tasks</Typography>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={56} />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Recent Tasks</Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate(ROUTES.TASKS)}
          >
            View all
          </Typography>
        </Box>

        {tasks.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            No tasks yet. Create one to get started.
          </Typography>
        ) : (
          <List disablePadding>
            {tasks.slice(0, 10).map(task => (
              <ListItemButton
                key={task.id}
                onClick={() => navigate(ROUTES.TASKS)}
                sx={{ borderRadius: 1, px: 1 }}
              >
                <ListItemText
                  primary={task.title}
                  secondary={dayjs(task.created_at).fromNow()}
                  slotProps={{
                    primary: { noWrap: true },
                    secondary: { variant: 'caption' },
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1, ml: 1, flexShrink: 0 }}>
                  <TaskPriorityChip priority={task.priority} />
                  <TaskStatusChip status={task.status} />
                </Box>
              </ListItemButton>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}
