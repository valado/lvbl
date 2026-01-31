import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TaskIcon from '@mui/icons-material/Assignment'
import FolderIcon from '@mui/icons-material/Folder'
import SettingsIcon from '@mui/icons-material/Settings'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'

export const DRAWER_WIDTH = 260

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
  { label: 'Tasks', icon: <TaskIcon />, path: ROUTES.TASKS },
  { label: 'Projects', icon: <FolderIcon />, path: ROUTES.PROJECTS },
  { label: 'Settings', icon: <SettingsIcon />, path: ROUTES.SETTINGS },
] as const

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const drawerContent = (
    <>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" noWrap sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
            LVBL
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Remote Controller
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ px: 1.5 }}>
        {NAV_ITEMS.map(item => {
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path)

          return (
            <ListItemButton
              key={item.path}
              selected={isActive}
              onClick={() => { navigate(item.path); onClose() }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.dark',
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'primary.light' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}
      </List>
    </>
  )

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, borderRight: '1px solid', borderColor: 'divider' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  )
}
