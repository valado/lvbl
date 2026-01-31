import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Project } from '@/types/database'

interface ProjectCardProps {
  project: Project
  taskCount: number
  onDelete: (id: string) => void
}

export function ProjectCard({ project, taskCount, onDelete }: ProjectCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" gutterBottom noWrap sx={{ maxWidth: '80%' }}>
            {project.name}
          </Typography>
          <IconButton size="small" color="error" onClick={() => onDelete(project.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>

        {project.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {project.description}
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary">
          {taskCount} task{taskCount !== 1 ? 's' : ''}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<OpenInNewIcon />}
          href={project.lovable_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in Lovable
        </Button>
      </CardActions>
    </Card>
  )
}
