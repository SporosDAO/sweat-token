import { Button, Grid, Paper, TextField, useMediaQuery, useTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import { useCallback, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useParams } from 'react-router-dom'
import { setSettings } from '../../api'
import { DaoSettingsDto } from '../../api/openapi'
import useAuth from '../../context/AuthContext'
import useToast from '../../context/ToastContext'
import axios, { AxiosError } from 'axios'
import { useGetPeople } from '../../graph/getPeople'

const useStyles = makeStyles((theme) => ({
  root: {},
  legal_content: {
    margin: '0 40px'
    // textAlign: 'center'
  },
  legal_button: {
    marginBottom: '10px',
    fontSize: '16px',
    lineHeight: '20px'
  }
}))

export default function Settings() {
  const theme = useTheme()
  const classes = useStyles()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { showToast } = useToast()
  const { requireAuth, user, error: authError, resetError } = useAuth()

  const { chainId, daoId } = useParams()
  const [formValues, setFormValues] = useState<DaoSettingsDto>({
    chainId: chainId || '',
    daoId: daoId || '',
    discordWebhookUrl: undefined,
    discordWebhookBotName: undefined
  })

  useEffect(() => {
    if (!authError) return
    showToast(authError, 'warning')
    resetError()
  }, [authError, resetError, showToast])

  const mutation = useMutation((daoSettingsDto: DaoSettingsDto) => setSettings(daoSettingsDto))

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setFormValues({
        ...formValues,
        [e.target.name]: e.target.value
      })
    },
    [formValues]
  )

  // user clicked save button, show sign form
  useEffect(() => {
    if (user) return
    requireAuth()
  })

  useEffect(() => {
    if (!mutation.isSuccess) return
    mutation.reset()
    showToast('Settings updated')
  }, [mutation, mutation.isSuccess, showToast])

  useEffect(() => {
    if (!mutation.isError) return
    mutation.reset()
    console.log('update failed', mutation.error)

    if (axios.isAxiosError(mutation.error)) {
      const err = mutation.error as AxiosError
      if (err.response?.status === 403) {
        showToast('You do not have enough permissions to change settings', 'warning')
      }
      return
    }

    showToast('Settings update failed', 'error')
  }, [mutation, mutation.isSuccess, showToast])

  const saveDiscordWebhook = () => {
    if (!formValues.discordWebhookBotName || !formValues.discordWebhookUrl) {
      showToast('Please complete the empty fields', 'warning')
      return
    }
    if (!user) return
    if (mutation.isLoading) return
    mutation.mutate(formValues)
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper
          sx={{
            p: 2
            // height: 240
          }}
        >
          <h2>Settings</h2>

          <Box component="form">
            <h3>Notifications</h3>
            <p>Provide the Discord webhook configuration to receive notifications for new proposals.</p>
            <TextField
              helperText="The secret webhook URL for your discord channel"
              placeholder="Discord Webhook URL"
              fullWidth
              type="text"
              name="discordWebhookUrl"
              onChange={onChange}
              value={formValues.discordWebhookUrl || ''}
              required={true}
              error={formValues.discordWebhookUrl !== undefined && !formValues.discordWebhookUrl?.length}
              onFocus={() => {
                if (formValues.discordWebhookUrl === undefined) formValues.discordWebhookUrl = ''
              }}
            />
            <TextField
              helperText="Name shown on the message"
              placeholder="Discord Bot Name"
              fullWidth
              type="text"
              name="discordWebhookBotName"
              onChange={onChange}
              value={formValues.discordWebhookBotName || ''}
              required={true}
              error={formValues.discordWebhookBotName !== undefined && !formValues.discordWebhookBotName?.length}
              onFocus={() => {
                if (formValues.discordWebhookBotName === undefined) formValues.discordWebhookBotName = ''
              }}
            />

            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button variant="contained" onClick={() => saveDiscordWebhook()}>
                Save
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}
