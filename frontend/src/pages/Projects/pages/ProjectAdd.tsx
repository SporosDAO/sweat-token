import { Box, Button, CircularProgress, Grid, InputAdornment, TextField } from '@mui/material'
import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { ProjectDto, ProjectDtoStatusEnum } from '../../../api/openapi'
import ContentBlock from '../../../components/ContentBlock'
import useDao from '../../../context/DaoContext'
import { createProject } from '../../../api'
import useToast from '../../../context/ToastContext'

export default function ProjectAdd() {
  const { daoId } = useDao()
  const { showToast } = useToast()

  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState({
    daoId,
    status: ProjectDtoStatusEnum.Open
  } as Record<string, any>)

  const [formValidation, setFormValidation] = useState({} as Record<string, boolean>)

  const validate = useCallback(
    (fieldName: string) => {
      setFormValidation({
        ...formValidation,
        [fieldName]: !formValues[fieldName]
      })
    },
    [formValidation, formValues]
  )

  const onBlur = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>) => {
    validate(e.target.name)
  }

  const setValue = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      // console.log(`set ${e.target.name}: ${e.target.value}`)
      setFormValues({
        ...formValues,
        [e.target.name]: e.target.value
      })
    },
    [formValues]
  )

  useEffect(() => {
    Object.keys(formValidation)
      .filter((fieldName) => formValidation[fieldName])
      .forEach((fieldName) => validate(fieldName))
  }, [formValidation, validate])

  const isValidField = useCallback(
    (field: string): boolean => {
      return formValidation[field] || false
    },
    [formValidation]
  )

  const save = useCallback(async (): Promise<void> => {
    if (!Object.keys(formValues).length) return
    // validation error
    if (Object.values(formValidation).filter((error) => error).length) return
    setLoading(true)
    await createProject({ ...formValues } as ProjectDto)
      .then(() => {
        //
      })
      .catch(() => {
        showToast('Error saving', 'error')
      })
      .finally(() => setLoading(false))
  }, [formValidation, formValues, showToast])

  return (
    <ContentBlock title="Add Project">
      {loading ? (
        <CircularProgress />
      ) : (
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            save()
          }}
        >
          <Grid container spacing={5}>
            <Grid item lg={8}>
              <TextField
                name="name"
                placeholder="Name"
                helperText="A project name used in proposals and listing"
                value={formValues['name'] || ''}
                onChange={setValue}
                error={isValidField('name')}
                onBlur={onBlur}
                required
                fullWidth
              />
              <TextField
                name="description"
                placeholder="Description"
                helperText="A project description to provide context to contributors and stakholders"
                value={formValues['description'] || ''}
                onChange={setValue}
                required
                multiline
                fullWidth
              />
            </Grid>
            <Grid item lg={4}>
              <TextField
                name="deadline"
                placeholder="Deadline"
                helperText="A completion date for this project"
                type="datetime-local"
                value={formValues['deadline'] || ''}
                onBlur={onBlur}
                error={isValidField('deadline')}
                onChange={setValue}
                required
                fullWidth
              />
              <TextField
                name="budget"
                placeholder="Budget"
                helperText="The budget requested"
                type="number"
                value={formValues['budget'] || ''}
                onChange={setValue}
                onBlur={onBlur}
                error={isValidField('budget')}
                required
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">$</InputAdornment>
                }}
              />
            </Grid>
          </Grid>
          <Button sx={{ mt: 5 }} fullWidth variant="contained" onClick={() => save()}>
            Save
          </Button>
        </Box>
      )}
    </ContentBlock>
  )
}
