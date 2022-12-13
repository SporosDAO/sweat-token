import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material'
import Header from '../../../../components/Header'

const Payment: React.FC<any> = (props) => {
  const { palette } = useTheme()

  return (
    <>
      <Header title="Deployment" subtitle="You are now ready to deploy your new DAO with a Series LLC wrapper." />
      <Divider orientation="horizontal" sx={{ m: '20px 0 24px' }} />
      <Card sx={{ p: 0 }}>
        <Box p="32px 32px 16px">
          <img style={{ width: '40px', marginBottom: '20px' }} src="/icons/zap.svg" alt="Zap Icon" />
          <Typography variant="body2" fontWeight={600} color={palette.primary.dark}>
            Delaware Series LLC
          </Typography>
          <Typography variant="h3" fontWeight={600} color={palette.grey[900]} letterSpacing="-0.02em">
            $199 value
          </Typography>
          <Typography variant="body1" color={palette.grey[500]} fontWeight={400}>
            Formation fee waived for a limited time.
          </Typography>
          <Box m="32px 0 0">
            <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
              <img src="/icons/check-icon.svg" alt="Check Icon" />
              <Typography variant="body1" color={palette.grey[500]} fontWeight={400}>
                Access to all features
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
              <img src="/icons/check-icon.svg" alt="Check Icon" />
              <Typography variant="body1" color={palette.grey[500]} fontWeight={400}>
                Operating Agreement
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
              <img src="/icons/check-icon.svg" alt="Check Icon" />
              <Typography variant="body1" color={palette.grey[500]} fontWeight={400}>
                Instant LLC creation
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box p="32px" sx={{ background: palette.grey[50] }}>
          <Button fullWidth size="large" variant="contained" onClick={props.onPay} data-testid="deploy-button">
            Deploy now
          </Button>
        </Box>
      </Card>
    </>
  )
}

export default Payment
