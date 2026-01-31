import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '@/config/theme'
import { AuthContext, useAuthProvider } from '@/hooks/useAuth'
import { ROUTES } from '@/config/routes'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { LoginPage } from '@/components/auth/LoginPage'
import { SignUpPage } from '@/components/auth/SignUpPage'
import { DashboardPage } from '@/components/dashboard/DashboardPage'
import { TasksPage } from '@/components/tasks/TasksPage'
import { ProjectsPage } from '@/components/projects/ProjectsPage'
import { SettingsPage } from '@/components/settings/SettingsPage'

export default function App() {
  const auth = useAuthProvider()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={auth}>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
            <Route
              element={
                <AuthGuard>
                  <AppLayout />
                </AuthGuard>
              }
            >
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.TASKS} element={<TasksPage />} />
              <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
              <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </ThemeProvider>
  )
}
