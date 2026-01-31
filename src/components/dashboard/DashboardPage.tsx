import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PendingIcon from '@mui/icons-material/Pending'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { useTaskStats } from '@/hooks/useTaskStats'
import { useTasks } from '@/hooks/useTasks'
import { StatsCard } from './StatsCard'
import { RecentTasksList } from './RecentTasksList'

export function DashboardPage() {
  const { stats } = useTaskStats()
  const { tasks, loading } = useTasks()

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Dashboard</Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Total Tasks"
            value={stats?.total_tasks ?? 0}
            Icon={AssignmentIcon}
            color="#7c3aed"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Pending"
            value={stats?.pending_tasks ?? 0}
            Icon={PendingIcon}
            color="#3b82f6"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Completed Today"
            value={stats?.completed_today ?? 0}
            Icon={CheckCircleIcon}
            color="#10b981"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Failed"
            value={stats?.failed_tasks ?? 0}
            Icon={ErrorIcon}
            color="#ef4444"
          />
        </Grid>
      </Grid>

      <RecentTasksList tasks={tasks} loading={loading} />
    </Box>
  )
}
