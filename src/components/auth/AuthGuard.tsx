import { Navigate } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/config/routes'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <>{children}</>
}
