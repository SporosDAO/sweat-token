import {
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { inviteMember } from '../../../api'
import { MemberDto, MemberInviteDto } from '../../../api/openapi'
import useAuth from '../../../context/AuthContext'
import useDao from '../../../context/DaoContext'
import useToast from '../../../context/ToastContext'

const roles = ['founder', 'projectManager']

interface InviteFormDialogProps {
  open: boolean
  onClose: () => void
}

export default function InviteFormDialog(props: InviteFormDialogProps) {
  const { showToast } = useToast()
  const { requireAuth, user } = useAuth()
  const { daoId } = useDao()

  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState({} as Record<string, any>)

  const updateFormValues = (name: string, value: any) =>
    setFormValues((formValues) => ({
      ...formValues,
      [name]: value
    }))

  const resetFormValues = () => setFormValues(() => ({}))

  const onChange = (e: any) => {
    updateFormValues(e.target.name, e.target.value)
  }

  const save = () => {
    if (loading) return
    setLoading(true)
    inviteMember({
      ...formValues,
      daoId: daoId
    } as MemberInviteDto)
      .then(() => {
        showToast('Invitation created', 'success')
        resetFormValues()
        props.onClose()
      })
      .catch((e: any) => {
        showToast('Invitation creation failed', 'error')
        console.error(e)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!props.open) return
    if (user) return
    requireAuth()
  }, [props.open, requireAuth, user])

  return (
    <Dialog onClose={props.onClose} open={props.open} keepMounted fullWidth>
      <DialogTitle>Invite a new member</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box component="form" p={2}>
            <Stack spacing={2}>
              <TextField
                placeholder="Wallet address"
                helperText="The new member wallet address"
                name="publicAddress"
                value={formValues['publicAddress'] || ''}
                required
                fullWidth
                onChange={onChange}
                // InputProps={{
                // startAdornment: <InputAdornment position="start">0x</InputAdornment>
                // }}
              />
              <TextField
                placeholder="Friendly name"
                helperText="The new member friendly name"
                name="name"
                value={formValues['name'] || ''}
                required
                fullWidth
                onChange={onChange}
                // InputProps={{
                // startAdornment: <InputAdornment position="start">0x</InputAdornment>
                // }}
              />

              <Autocomplete
                placeholder="Role(s)"
                multiple
                filterSelectedOptions
                options={roles}
                value={formValues['roles'] || []}
                fullWidth
                onChange={(event: any, newValue: string[]) => {
                  updateFormValues('roles', newValue || [])
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Role(s)"
                    helperText="Assign additional roles to this member if needed."
                  />
                )}
              />
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {loading ? (
          <></>
        ) : (
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Button variant="contained" onClick={save}>
              Send
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  )
}
