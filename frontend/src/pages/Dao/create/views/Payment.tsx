import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { Avatar, CardContent, useTheme } from '@mui/material'
import Header from '../../../../components/Header'
import { Done, TrendingUp } from '@mui/icons-material'

const Payment: React.FC<any> = (props) => {
  const { palette } = useTheme()

  return (
    <>
      <Header title="Deployment" subtitle="You are now ready to deploy your new DAO with a Series LLC wrapper." />
      <Divider orientation="horizontal" sx={{ m: '20px 0 24px' }} />
      <Card sx={{ p: 0 }}>
        <CardContent>
          <Box p="32px 32px 16px">
            <Avatar sx={{ color: palette.primary.light, bgcolor: palette.action.hover }}>
              <TrendingUp fontSize="large" />
            </Avatar>{' '}
            <Typography variant="body2" color={palette.primary.dark}>
              Delaware Series LLC
            </Typography>
            <Typography variant="h3" letterSpacing="-0.02em">
              $199 value
            </Typography>
            <Typography variant="body1" color={palette.text.secondary}>
              Formation fee waived for a limited time.
            </Typography>
            <Box m="32px 0 0">
              <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
                <Avatar sx={{ color: palette.primary.light, bgcolor: palette.action.hover }}>
                  <Done fontSize="small" />
                </Avatar>{' '}
                <Typography variant="body1" color={palette.text.secondary}>
                  Access to all features
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
                <Avatar sx={{ color: palette.primary.light, bgcolor: palette.action.hover }}>
                  <Done fontSize="small" />
                </Avatar>{' '}
                <Typography variant="body1" color={palette.text.secondary}>
                  Operating Agreement
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
                <Avatar sx={{ color: palette.primary.light, bgcolor: palette.action.hover }}>
                  <Done fontSize="small" />
                </Avatar>{' '}
                <Typography variant="body1" color={palette.text.secondary}>
                  Instant LLC creation
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box p="32px">
            <Button fullWidth size="large" variant="contained" onClick={props.onPay} data-testid="deploy-button">
              Deploy now
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}

export default Payment
