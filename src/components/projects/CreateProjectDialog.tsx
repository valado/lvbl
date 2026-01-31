import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
} from '@mui/material'
import type { CreateProjectInput } from '@/types/api'

interface CreateProjectDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (input: CreateProjectInput) => Promise<void>
}

export function CreateProjectDialog({ open, onClose, onSubmit }: CreateProjectDialogProps) {
  const [name, setName] = useState('')
  const [lovableUrl, setLovableUrl] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setName('')
    setLovableUrl('')
    setDescription('')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !lovableUrl.trim()) return

    setLoading(true)
    setError(null)
    try {
      await onSubmit({
        name: name.trim(),
        lovable_url: lovableUrl.trim(),
        description: description.trim() || null,
      })
      reset()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Register Project</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Project Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Lovable Project URL"
              value={lovableUrl}
              onChange={e => setLovableUrl(e.target.value)}
              required
              fullWidth
              placeholder="https://lovable.dev/projects/..."
            />

            <TextField
              label="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { reset(); onClose() }}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !name.trim() || !lovableUrl.trim()}
          >
            {loading ? 'Creating...' : 'Register'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
