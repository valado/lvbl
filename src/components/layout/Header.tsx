import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DRAWER_WIDTH } from './Sidebar'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary' }}>
          {user?.email ?? 'demo@example.com'}
        </Typography>

        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
            {(user?.email?.[0] ?? 'D').toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => { setAnchorEl(null); signOut() }}>
            Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
