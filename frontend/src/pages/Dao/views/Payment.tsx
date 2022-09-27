import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { FormikValues, FormikHandlers } from 'formik'

import { colors } from '../../../theme/colorPalette'

const Payment: React.FC<Partial<FormikValues & FormikHandlers>> = ({ values, handleChange }) => (
  <>
    <Grid container>
      <Grid item md={7}>
        <Typography variant="h6" mb="4px">
          Payment
        </Typography>
        <Typography variant="subtitle2" color={colors.gray[700]}>
          Please provide payment to complete your transaction, and deploy your LLC on-chain.
        </Typography>
      </Grid>
      <Grid item md={5} display="flex" justifyContent="flex-end">
        <Button variant="outlined">Bridge funds</Button>
      </Grid>
    </Grid>
    <Divider orientation="horizontal" sx={{ m: '20px 0 24px' }} />
    <Card sx={{ p: 0 }}>
      <Box p="32px 32px 16px">
        <img style={{ width: '40px', marginBottom: '20px' }} src="/icons/zap.svg" alt="Zap Icon" />
        <Typography variant="body2" fontWeight={600} color={colors.primary[700]}>
          Delaware Series LLC
        </Typography>
        <Typography variant="h3" fontWeight={600} color={colors.gray[900]} letterSpacing="-0.02em">
          $199
        </Typography>
        <Typography variant="body1" color={colors.gray[500]} fontWeight={400}>
          one-time fee paid in DAI or USDC
        </Typography>
        <Box m="32px 0 0">
          <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
            <img src="/icons/check-icon.svg" alt="Check Icon" />
            <Typography variant="body1" color={colors.gray[500]} fontWeight={400}>
              Access to all features
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
            <img src="/icons/check-icon.svg" alt="Check Icon" />
            <Typography variant="body1" color={colors.gray[500]} fontWeight={400}>
              Operating Agreement
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
            <img src="/icons/check-icon.svg" alt="Check Icon" />
            <Typography variant="body1" color={colors.gray[500]} fontWeight={400}>
              Instant LLC creation
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box p="32px" sx={{ background: colors.gray[50] }}>
        <Button fullWidth size="xl" variant="contained">
          Pay now
        </Button>
      </Box>
    </Card>
  </>
)

export default Payment
