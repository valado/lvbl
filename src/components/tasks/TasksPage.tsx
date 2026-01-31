import { useState, useCallback } from 'react'
import { Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { Task } from '@/types/database'
import type { CreateTaskInput } from '@/types/api'
import { useTasks } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'
import { TaskFilters } from './TaskFilters'
import { TaskTable } from './TaskTable'
import { TaskDetailDrawer } from './TaskDetailDrawer'
import { CreateTaskDialog } from './CreateTaskDialog'

export function TasksPage() {
  const {
    tasks,
    totalCount,
    loading,
    filters,
    pagination,
    setFilters,
    setPagination,
    createTask,
    updateTask,
    executeTask,
  } = useTasks()
  const { projects } = useProjects()

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)

  const handleRowClick = useCallback((task: Task) => {
    setSelectedTask(task)
    setDrawerOpen(true)
  }, [])

  const handleExecute = useCallback(async (id: string) => {
    await executeTask(id)
    setDrawerOpen(false)
  }, [executeTask])

  const handleCancel = useCallback(async (id: string) => {
    await updateTask(id, { status: 'cancelled' })
    setDrawerOpen(false)
  }, [updateTask])

  const handleCreate = useCallback(async (input: CreateTaskInput) => {
    await createTask(input)
  }, [createTask])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          New Task
        </Button>
      </Box>

      <TaskFilters filters={filters} onChange={setFilters} />

      <TaskTable
        tasks={tasks}
        totalCount={totalCount}
        loading={loading}
        paginationModel={{ page: pagination.page, pageSize: pagination.page_size }}
        onPaginationChange={(model) =>
          setPagination({ page: model.page, page_size: model.pageSize })
        }
        onRowClick={handleRowClick}
      />

      <TaskDetailDrawer
        task={selectedTask}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onExecute={handleExecute}
        onCancel={handleCancel}
      />

      <CreateTaskDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        projects={projects}
      />
    </Box>
  )
}
