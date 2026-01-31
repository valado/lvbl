import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Alert,
} from '@mui/material'
import TelegramIcon from '@mui/icons-material/Telegram'

export function PlatformLinkSection() {
  const [linkCode, setLinkCode] = useState<string | null>(null)

  function generateCode() {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setLinkCode(code)
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Platform Connections
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <TelegramIcon color="info" />
            <Box>
              <Typography variant="body1">Telegram</Typography>
              <Typography variant="body2" color="text.secondary">
                Send tasks directly from Telegram
              </Typography>
            </Box>
          </Box>
          <Chip label="Connected" color="success" variant="outlined" size="small" />
        </Box>

        {!linkCode ? (
          <Button variant="outlined" size="small" sx={{ mt: 2 }} onClick={generateCode}>
            Generate New Link Code
          </Button>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            Send <code>/link {linkCode}</code> to the bot in Telegram to link a new account.
            This code expires in 10 minutes.
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
