import { useState, useCallback, useMemo } from 'react'
import { Box, Typography, Button, Skeleton, Card, CardContent } from '@mui/material'
import Grid from '@mui/material/Grid2'
import AddIcon from '@mui/icons-material/Add'
import { useProjects } from '@/hooks/useProjects'
import { useTasks } from '@/hooks/useTasks'
import type { CreateProjectInput } from '@/types/api'
import { ProjectCard } from './ProjectCard'
import { CreateProjectDialog } from './CreateProjectDialog'

export function ProjectsPage() {
  const { projects, loading, createProject, deleteProject } = useProjects()
  const { tasks } = useTasks()
  const [createOpen, setCreateOpen] = useState(false)

  const taskCountByProject = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const task of tasks) {
      if (task.project_id) {
        counts[task.project_id] = (counts[task.project_id] ?? 0) + 1
      }
    }
    return counts
  }, [tasks])

  const handleCreate = useCallback(async (input: CreateProjectInput) => {
    await createProject(input)
  }, [createProject])

  const handleDelete = useCallback(async (id: string) => {
    await deleteProject(id)
  }, [deleteProject])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Register Project
        </Button>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="30%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : projects.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No projects registered yet.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Register your Lovable projects to link tasks to them.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map(project => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
              <ProjectCard
                project={project}
                taskCount={taskCountByProject[project.id] ?? 0}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateProjectDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </Box>
  )
}
