import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Tooltip,
  Stack,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CancelIcon from '@mui/icons-material/Cancel'
import dayjs from 'dayjs'
import type { Task } from '@/types/database'
import { useTaskLogs } from '@/hooks/useTaskLogs'
import { TaskStatusChip } from './TaskStatusChip'
import { TaskPriorityChip } from './TaskPriorityChip'

interface TaskDetailDrawerProps {
  task: Task | null
  open: boolean
  onClose: () => void
  onExecute: (id: string) => void
  onCancel: (id: string) => void
}

export function TaskDetailDrawer({ task, open, onClose, onExecute, onCancel }: TaskDetailDrawerProps) {
  const { logs } = useTaskLogs(task?.id ?? null)

  if (!task) return null

  const canExecute = task.status === 'pending' || task.status === 'ready'
  const canCancel = task.status === 'pending' || task.status === 'ready'

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 480 }, p: 3 } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" noWrap sx={{ maxWidth: 380 }}>
          {task.title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TaskStatusChip status={task.status} />
        <TaskPriorityChip priority={task.priority} />
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        {canExecute && (
          <Button
            size="small"
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={() => onExecute(task.id)}
          >
            Execute Now
          </Button>
        )}
        {canCancel && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => onCancel(task.id)}
          >
            Cancel
          </Button>
        )}
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Prompt */}
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Prompt
      </Typography>
      <Box sx={{
        bgcolor: 'background.default',
        p: 2,
        borderRadius: 1,
        mb: 2,
        maxHeight: 200,
        overflow: 'auto',
        position: 'relative',
      }}>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {task.prompt}
        </Typography>
        <Tooltip title="Copy prompt">
          <IconButton
            size="small"
            onClick={() => copyToClipboard(task.prompt)}
            sx={{ position: 'absolute', top: 4, right: 4 }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Lovable URL */}
      {task.lovable_url && (
        <>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Lovable URL
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<OpenInNewIcon />}
              href={task.lovable_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Lovable
            </Button>
            <Tooltip title="Copy URL">
              <IconButton size="small" onClick={() => copyToClipboard(task.lovable_url!)}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}

      {/* Error */}
      {task.error_message && (
        <>
          <Typography variant="subtitle2" color="error" gutterBottom>
            Error
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'error.main' }}>
            {task.error_message}
          </Typography>
        </>
      )}

      {/* Details */}
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Details
      </Typography>
      <Box sx={{ mb: 2 }}>
        <DetailRow label="Type" value={task.task_type === 'new_project' ? 'New Project' : 'Existing Project'} />
        <DetailRow label="Project" value={task.project?.name ?? 'None'} />
        <DetailRow label="Source" value={task.source_platform} />
        <DetailRow label="Created" value={dayjs(task.created_at).format('MMM D, YYYY h:mm A')} />
        {task.scheduled_at && <DetailRow label="Scheduled" value={dayjs(task.scheduled_at).format('MMM D, YYYY h:mm A')} />}
        {task.executed_at && <DetailRow label="Executed" value={dayjs(task.executed_at).format('MMM D, YYYY h:mm A')} />}
      </Box>

      {/* Audit Log */}
      {logs.length > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Activity Log
          </Typography>
          <Stack spacing={1}>
            {logs.map((log) => (
              <Box key={log.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
                <Box>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {log.action.replace('_', ' ')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(log.created_at).format('MMM D, h:mm A')}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </>
      )}
    </Drawer>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{value}</Typography>
    </Box>
  )
}
