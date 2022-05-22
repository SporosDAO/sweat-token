import {
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  InputLabel,
  Slider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { createTask } from '../../../api'
import { CreateTaskDto, ProjectDto } from '../../../api/openapi'
import useAuth from '../../../context/AuthContext'
import useToast from '../../../context/ToastContext'

const skills = ['Mentor', 'Software Engineer', 'UX/Designer', 'Legal', 'Operations', 'Finance', 'Policy']

interface TaskAddDialogProps {
  project: ProjectDto
  onClose: () => void
  open: boolean
}

export default function TaskAddDialog(props: TaskAddDialogProps) {
  const { showToast } = useToast()
  const { requireAuth, user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState({} as Record<string, any>)
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (user) return
    requireAuth()
  }, [requireAuth, user])

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
    createTask({
      ...formValues,
      daoId: props.project.daoId,
      projectId: props.project.projectId,
      ownerId: user?.userId
    } as CreateTaskDto)
      .then(() => {
        showToast('Task created', 'success')
        resetFormValues()
        props.onClose()
      })
      .catch((e: any) => {
        showToast('Task creation failed', 'error')
        console.error(e)
      })
      .finally(() => setLoading(false))
  }

  return (
    <Dialog onClose={props.onClose} open={props.open} keepMounted fullWidth>
      <DialogTitle>Add task</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box component="form" p={2}>
            {page === 0 ? (
              <Stack spacing={2}>
                <TextField
                  placeholder="Title"
                  label="Scope of work"
                  name="name"
                  value={formValues['name'] || ''}
                  required
                  fullWidth
                  onChange={onChange}
                />

                <Autocomplete
                  placeholder="Skill(s)"
                  freeSolo
                  multiple
                  filterSelectedOptions
                  options={skills}
                  value={formValues['skills'] || []}
                  fullWidth
                  onChange={(event: any, newValue: any[]) => {
                    updateFormValues('skills', newValue || [])
                  }}
                  renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => <TextField {...params} label="Skill(s)" />}
                />

                <Box>
                  <InputLabel>Commitment &nbsp;</InputLabel>

                  <ToggleButtonGroup
                    fullWidth
                    color="primary"
                    value={formValues['type']}
                    exclusive
                    onChange={(e: any) => {
                      updateFormValues('type', e.target.value)
                      if (formValues['type'] === undefined) setPage(1)
                    }}
                  >
                    <ToggleButton value="onetime">One Time</ToggleButton>
                    <ToggleButton value="ongoing">Ongoing</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Stack>
            ) : formValues['type'] === 'ongoing' ? (
              <Stack spacing={2}>
                <TextField
                  placeholder="Budget"
                  helperText="Maximum amount (monthly)"
                  name="budget"
                  value={formValues['budget'] || ''}
                  type="number"
                  required
                  fullWidth
                  onChange={onChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">$</InputAdornment>
                  }}
                />

                <Box>
                  <InputLabel>Time commitment (monthly)</InputLabel>
                  <Slider
                    sx={{ mt: 5 }}
                    getAriaLabel={() => 'Bands'}
                    value={formValues['bands'] || [1, 6]}
                    onChange={(e: any, value: number | number[]) => updateFormValues('bands', value)}
                    valueLabelDisplay="auto"
                    min={1}
                    step={1}
                    max={10}
                  />
                  <Box sx={{ textAlign: 'center' }}>
                    {formValues['budget'] && formValues['bands']
                      ? `${Math.floor((formValues['budget'] / 10) * formValues['bands'][0])}$ - ${Math.floor(
                          (formValues['budget'] / 10) * formValues['bands'][1]
                        )}$`
                      : ''}
                  </Box>
                </Box>
              </Stack>
            ) : (
              <Stack spacing={2}>
                <TextField
                  placeholder="Budget"
                  helperText="Amount for the task"
                  name="budget"
                  value={formValues['budget'] || ''}
                  type="number"
                  required
                  fullWidth
                  onChange={onChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">$</InputAdornment>
                  }}
                />

                <TextField
                  placeholder="Deadline"
                  helperText="Expected date of completion of the task"
                  name="deadline"
                  value={formValues['deadline'] || ''}
                  type="date"
                  required
                  fullWidth
                  onChange={onChange}
                />
              </Stack>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {loading ? (
          <></>
        ) : (
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            {page === 1 ? (
              <Button variant="outlined" onClick={() => setPage(0)}>
                Back
              </Button>
            ) : formValues['type'] !== undefined ? (
              <Button variant="outlined" onClick={() => setPage(1)}>
                Next
              </Button>
            ) : (
              <></>
            )}
            {page === 1 ? (
              <Button variant="contained" onClick={save}>
                Save
              </Button>
            ) : (
              <></>
            )}
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  )
}
