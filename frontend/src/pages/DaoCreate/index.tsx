import { Button, CircularProgress, Stack, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDao } from '../../api'
import { CreateDaoDto, DaoDto } from '../../api/openapi'
import ContentBlock from '../../components/ContentBlock'
import useAuth from '../../context/AuthContext'
import { getDaoUrl } from '../../context/PageContext'
import useToast from '../../context/ToastContext'
import { PageLayout } from '../../layout/Page'

export default function DaoCreate() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { requireAuth, user, loading: userLoading } = useAuth()

  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState({} as Record<string, any>)
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (userLoading) return
    if (user) return
    requireAuth()
  }, [requireAuth, user, userLoading])

  const updateFormValues = (name: string, value: any) =>
    setFormValues((formValues) => ({
      ...formValues,
      [name]: value
    }))

  const onChange = (e: any) => {
    updateFormValues(e.target.name, e.target.value)
  }

  const save = () => {
    if (loading || userLoading) return
    setLoading(true)
    createDao({
      ...formValues,
      ownerId: user?.userId || ''
    } as unknown as CreateDaoDto)
      .then((dao: DaoDto) => {
        showToast('DAO created', 'success')
        navigate(getDaoUrl(dao.daoId))
        // resetFormValues()
        // setPage(0)
      })
      .catch((e: any) => {
        showToast('DAO creation failed', 'error')
        console.error(e)
      })
      .finally(() => setLoading(false))
  }

  return (
    <PageLayout withDrawer={false}>
      <ContentBlock title={`Create ${formValues['name'] || ''} DAO`}>
        {loading || userLoading ? (
          <CircularProgress />
        ) : (
          <Box component="form">
            {page === 0 ? (
              <Stack spacing={2}>
                <TextField
                  placeholder="Name"
                  helperText="Name of the DAO"
                  name="name"
                  value={formValues['name'] || ''}
                  required
                  fullWidth
                  onChange={onChange}
                />
                <TextField
                  multiline
                  placeholder="Mission"
                  helperText="A mission statement for the DAO"
                  name="mission"
                  value={formValues['mission'] || ''}
                  required
                  fullWidth
                  onChange={onChange}
                />
                <TextField
                  placeholder="Website"
                  helperText="Website of the DAO"
                  name="website"
                  value={formValues['website'] || ''}
                  required
                  fullWidth
                  onChange={onChange}
                />
                <TextField
                  placeholder="Logo"
                  helperText="Logo image of the DAO"
                  name="logo"
                  value={formValues['logo'] || ''}
                  required
                  fullWidth
                  onChange={onChange}
                />
              </Stack>
            ) : (
              <Stack spacing={2}>
                <TextField
                  placeholder="KaliDao address"
                  helperText="KaliDao contract address of the DAO"
                  name="kaliAddress"
                  value={formValues['kaliAddress'] || ''}
                  required
                  fullWidth
                  onChange={onChange}
                />
              </Stack>
            )}
            <Box>
              <Stack spacing={2} sx={{ mt: 2 }} direction="row" justifyContent="space-between">
                {page === 1 ? (
                  <Button variant="contained" onClick={() => setPage(0)}>
                    Previous
                  </Button>
                ) : (
                  <></>
                )}
                {page === 0 ? (
                  <Button variant="contained" onClick={() => setPage(1)}>
                    Continue
                  </Button>
                ) : (
                  <Button variant="contained" onClick={() => save()}>
                    Save
                  </Button>
                )}
              </Stack>
            </Box>
          </Box>
        )}
      </ContentBlock>
    </PageLayout>
  )
}
