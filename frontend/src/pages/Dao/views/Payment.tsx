import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

const Payment: React.FC = () => (
  <>
    <Grid container>
      <Grid item md={8}>
        <Typography variant="h2" sx={{ mb: '4px' }}>
          Payment
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#364152' }}>
          Please provide payment to complete your transaction, and deploy your DAO on-chain.
        </Typography>
      </Grid>
      <Grid
        item
        md={4}
        sx={{
          justifyContent: 'flex-end',
          display: 'flex'
        }}
      >
        <Button className="bridge-button">Bridge funds</Button>
      </Grid>
    </Grid>

    <Divider orientation="horizontal" />

    <Card className="payment-card">
      <Box sx={{ p: '32px 32px 16px' }}>
        <img style={{ width: '40px' }} src="/icons/zap.svg" alt="Zap Icon" />
        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '20px', lineHeight: '30px', color: '#3B7C0F' }}>
          Delaware Series LLC
        </Typography>
        <Typography variant="h2" sx={{ fontWeight: 600, fontSize: '48px', lineHeight: '60px' }}>
          $199
        </Typography>
        <Typography variant="title" sx={{ color: '#697586', fontWeight: 400 }}>
          one-time fee paid in DAI or USDC
        </Typography>
        <Box sx={{ margin: '32px 0 0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
            <img src="/icons/check-icon.svg" alt="Check Icon" />
            <Typography variant="title" sx={{ color: '#697586', fontWeight: 400 }}>
              Access to all features
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
            <img src="/icons/check-icon.svg" alt="Check Icon" />
            <Typography variant="title" sx={{ color: '#697586', fontWeight: 400 }}>
              Operating Agreement
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', margin: '16px 0', gap: '10px' }}>
            <img src="/icons/check-icon.svg" alt="Check Icon" />
            <Typography variant="title" sx={{ color: '#697586', fontWeight: 400 }}>
              Instant LLC creation
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="card-footer">
        <Button className="pay-now">Pay now</Button>
      </Box>
    </Card>
  </>
)

export default Payment
