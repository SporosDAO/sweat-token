import { Grid, Paper, useTheme, useMediaQuery, Input, TextField, Stack, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from 'react-query'
import { setSettings } from '../../api'
import { DaoSettingsDto } from '../../api/openapi'
import { couldStartTrivia } from 'typescript'

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

  const { daoId } = useParams()
  const [formValues, setFormValues] = useState<DaoSettingsDto>({ daoId: daoId || '' })

  const mutation = useMutation((daoSettingsDto: DaoSettingsDto) => {
    return setSettings(daoSettingsDto)
  })

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setFormValues({
        ...formValues,
        [e.target.name]: e.target.value
      })
    },
    [formValues]
  )

  const saveDiscordWebhook = () => {
    console.log('save discord')
    if (!formValues.discordWebhookBotName || !formValues.discordWebhookUrl) return
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
            />
            <TextField
              helperText="Name shown on the message"
              placeholder="Discord Bot Name"
              fullWidth
              type="text"
              name="discordWebhookBotName"
              onChange={onChange}
              value={formValues.discordWebhookBotName || ''}
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
