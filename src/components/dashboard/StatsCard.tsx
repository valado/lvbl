import { Card, CardContent, Typography, Box } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'

interface StatsCardProps {
  title: string
  value: number
  Icon: SvgIconComponent
  color: string
}

export function StatsCard({ title, value, Icon, color }: StatsCardProps) {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2.5 }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `${color}20`,
        }}>
          <Icon sx={{ color, fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5">
            {value.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
