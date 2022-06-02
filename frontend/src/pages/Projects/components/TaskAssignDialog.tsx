import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useEffect, useState } from 'react'
import { listMembers, updateTask } from '../../../api'
import { ExtendedMemberDto, TaskDto } from '../../../api/openapi'
import useAuth from '../../../context/AuthContext'
import useToast from '../../../context/ToastContext'

interface TaskAssignDialogProps {
  task?: TaskDto
  onClose: () => void
  open: boolean
}

export default function TaskAssignDialog(props: TaskAssignDialogProps) {
  const { showToast } = useToast()
  const { requireAuth, user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState({} as Record<string, any>)
  const [page, setPage] = useState(0)

  const [options, setOptions] = useState<readonly ExtendedMemberDto[]>([])
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  useEffect(() => {
    if (!props.open) return
    if (user) return
    requireAuth()
  }, [props.open, requireAuth, user])

  const updateFormValues = (name: string, value: any) =>
    setFormValues((formValues) => ({
      ...formValues,
      [name]: value
    }))

  const resetFormValues = () => setFormValues(() => ({}))

  const onChange = (e: any) => {
    updateFormValues(e.target.name, e.target.value)
  }

  const findMembers = useCallback(
    (match?: string): Promise<ExtendedMemberDto[]> => {
      return listMembers({
        daoId: props.task?.daoId,
        limit: 20,
        match
      })
    },
    [props.task?.daoId]
  )

  useEffect(() => {
    if (!props.open) return
    if (!open) {
      setOptions([])
    }
  }, [open, props.open])

  useEffect(() => {
    let active = true

    if (!props.open) return
    if (loading) return

    findMembers(inputValue)
      .then((list) => {
        if (active) setOptions([...list])
      })
      .catch(() => {
        showToast('Failed to retrieve contributors', 'error')
      })
      .finally(() => setLoading(false))
    return () => {
      active = false
    }
  }, [findMembers, loading, inputValue, showToast, props.open])

  const save = () => {
    if (loading) return
    setLoading(true)
    updateTask({
      daoId: props.task?.daoId,
      projectId: props.task?.projectId,
      taskId: props.task?.taskId,
      ...formValues
    } as TaskDto)
      .then(() => {
        showToast('Task assigned', 'success')
        resetFormValues()
        setPage(0)
        props.onClose()
      })
      .catch((e: any) => {
        showToast('Task assignment failed', 'error')
        console.error(e)
      })
      .finally(() => setLoading(false))
  }

  return (
    <Dialog onClose={props.onClose} open={props.open} keepMounted fullWidth>
      <DialogTitle>Assign task</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box component="form" p={2}>
            <Stack spacing={2}>
              <Autocomplete
                placeholder="Contributor"
                filterSelectedOptions
                value={formValues['contributorId'] || null}
                fullWidth
                filterOptions={(x) => x}
                options={options}
                isOptionEqualToValue={(option: ExtendedMemberDto, value: ExtendedMemberDto) =>
                  option.name === value.name || option.publicAddress === value.publicAddress
                }
                getOptionLabel={(option: ExtendedMemberDto) => {
                  // console.log('option', option)

                  let member = { ...option }

                  if (typeof option === 'string') {
                    const m = options.filter((o) => o.userId === (option as string))
                    if (!m.length) return ''
                    member = { ...m[0] }
                  }

                  return member.name || member.publicAddress
                }}
                onChange={(event: any, newValue: ExtendedMemberDto | null) => {
                  updateFormValues('contributorId', newValue ? newValue.userId : undefined)
                }}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Contributor"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      )
                    }}
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
            <Button variant="contained" onClick={save} aria-label="save">
              Save
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  )
}
