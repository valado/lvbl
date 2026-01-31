import { Box, Typography, Card, CardContent, TextField, Stack } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { PlatformLinkSection } from './PlatformLinkSection'

export function SettingsPage() {
  const { user } = useAuth()

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Settings</Typography>

      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account
            </Typography>
            <TextField
              label="Email"
              value={user?.email ?? ''}
              fullWidth
              disabled
              margin="normal"
            />
            <TextField
              label="Display Name"
              value={user?.user_metadata?.display_name ?? ''}
              fullWidth
              disabled
              margin="normal"
            />
          </CardContent>
        </Card>

        <PlatformLinkSection />
      </Stack>
    </Box>
  )
}
