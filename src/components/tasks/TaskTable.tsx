import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Task } from '@/types/database'
import { TaskStatusChip } from './TaskStatusChip'
import { TaskPriorityChip } from './TaskPriorityChip'

dayjs.extend(relativeTime)

const columns: GridColDef<Task>[] = [
  {
    field: 'title',
    headerName: 'Title',
    flex: 1,
    minWidth: 200,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => <TaskStatusChip status={params.value} />,
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 110,
    renderCell: (params) => <TaskPriorityChip priority={params.value} />,
  },
  {
    field: 'task_type',
    headerName: 'Type',
    width: 140,
    valueFormatter: (value: string) => value === 'new_project' ? 'New Project' : 'Existing Project',
  },
  {
    field: 'source_platform',
    headerName: 'Source',
    width: 100,
    valueFormatter: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
  },
  {
    field: 'created_at',
    headerName: 'Created',
    width: 140,
    valueFormatter: (value: string) => dayjs(value).fromNow(),
  },
]

interface TaskTableProps {
  tasks: Task[]
  totalCount: number
  loading: boolean
  paginationModel: GridPaginationModel
  onPaginationChange: (model: GridPaginationModel) => void
  onRowClick: (task: Task) => void
}

export function TaskTable({
  tasks,
  totalCount,
  loading,
  paginationModel,
  onPaginationChange,
  onRowClick,
}: TaskTableProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={tasks}
        columns={columns}
        rowCount={totalCount}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        paginationMode="server"
        onRowClick={(params) => onRowClick(params.row)}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          border: 'none',
          '& .MuiDataGrid-row': { cursor: 'pointer' },
          '& .MuiDataGrid-cell:focus': { outline: 'none' },
        }}
      />
    </Box>
  )
}
