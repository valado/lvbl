import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Stack,
  Alert,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import type { TaskPriority, TaskType, Project } from '@/types/database'
import type { CreateTaskInput } from '@/types/api'

const MAX_PROMPT_LENGTH = 50000

interface CreateTaskDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (input: CreateTaskInput) => Promise<void>
  projects: Project[]
}

export function CreateTaskDialog({ open, onClose, onSubmit, projects }: CreateTaskDialogProps) {
  const [title, setTitle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [taskType, setTaskType] = useState<TaskType>('new_project')
  const [projectId, setProjectId] = useState<string>('')
  const [priority, setPriority] = useState<TaskPriority>('normal')
  const [scheduledAt, setScheduledAt] = useState<Dayjs | null>(null)
  const [imageUrls, setImageUrls] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setTitle('')
    setPrompt('')
    setTaskType('new_project')
    setProjectId('')
    setPriority('normal')
    setScheduledAt(null)
    setImageUrls('')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !prompt.trim()) return

    setLoading(true)
    setError(null)
    try {
      const urls = imageUrls.split('\n').map(u => u.trim()).filter(Boolean)
      await onSubmit({
        title: title.trim(),
        prompt: prompt.trim(),
        task_type: taskType,
        project_id: taskType === 'existing_project' && projectId ? projectId : null,
        priority,
        image_urls: urls,
        scheduled_at: scheduledAt ? scheduledAt.toISOString() : null,
      })
      reset()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Prompt"
              value={prompt}
              onChange={e => setPrompt(e.target.value.slice(0, MAX_PROMPT_LENGTH))}
              required
              fullWidth
              multiline
              rows={6}
              helperText={`${prompt.length.toLocaleString()} / ${MAX_PROMPT_LENGTH.toLocaleString()}`}
            />

            <ToggleButtonGroup
              value={taskType}
              exclusive
              onChange={(_, val: TaskType | null) => { if (val) setTaskType(val) }}
              fullWidth
              size="small"
            >
              <ToggleButton value="new_project">New Project</ToggleButton>
              <ToggleButton value="existing_project">Existing Project</ToggleButton>
            </ToggleButtonGroup>

            {taskType === 'existing_project' && (
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  value={projectId}
                  label="Project"
                  onChange={e => setProjectId(e.target.value)}
                >
                  {projects.map(p => (
                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={e => setPriority(e.target.value as TaskPriority)}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Schedule (optional)"
                value={scheduledAt}
                onChange={setScheduledAt}
                minDateTime={dayjs()}
                slotProps={{
                  textField: { fullWidth: true },
                  actionBar: { actions: ['clear', 'accept'] },
                }}
              />
            </LocalizationProvider>

            <TextField
              label="Image URLs (one per line)"
              value={imageUrls}
              onChange={e => setImageUrls(e.target.value)}
              fullWidth
              multiline
              rows={2}
              helperText="Optional reference images for the prompt"
            />

            <Typography variant="caption" color="text.secondary">
              Tasks without a schedule will be executed immediately.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { reset(); onClose() }}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !title.trim() || !prompt.trim()}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
