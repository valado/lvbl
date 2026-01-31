import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import type { TaskFilters as TaskFiltersType } from '@/types/api'
import type { TaskStatus, TaskPriority } from '@/types/database'

const STATUSES: TaskStatus[] = ['pending', 'ready', 'generating', 'completed', 'failed', 'cancelled']
const PRIORITIES: TaskPriority[] = ['low', 'normal', 'high', 'urgent']

interface TaskFiltersProps {
  filters: TaskFiltersType
  onChange: (filters: TaskFiltersType) => void
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
      <TextField
        size="small"
        placeholder="Search tasks..."
        value={filters.search ?? ''}
        onChange={e => onChange({ ...filters, search: e.target.value || undefined })}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ minWidth: 220 }}
      />

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status ?? ''}
          label="Status"
          onChange={e => onChange({ ...filters, status: (e.target.value || null) as TaskStatus | null })}
        >
          <MenuItem value="">All</MenuItem>
          {STATUSES.map(s => (
            <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={filters.priority ?? ''}
          label="Priority"
          onChange={e => onChange({ ...filters, priority: (e.target.value || null) as TaskPriority | null })}
        >
          <MenuItem value="">All</MenuItem>
          {PRIORITIES.map(p => (
            <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>{p}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
