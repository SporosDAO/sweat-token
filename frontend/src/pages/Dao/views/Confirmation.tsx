import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { FormikValues, FormikHandlers } from 'formik'

import Header from '../components/Header'
import { AlertIcon } from '../../../components/Icons'

const Confirmation: React.FC<Partial<FormikValues & FormikHandlers>> = ({ values, handleChange }) => (
  <>
    <Header
      title="Confirmation"
      subtitle="Please make sure your name and token symbol are correct. Note: we know getting started can seem confusing, so we help take the guess work out of it by providing  default settings. All of these settings can be adjusted after you deploy your LLC."
    />

    <Card className="founder-card">
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#121926', mb: '20px' }}>
          Structure
        </Typography>
        <Divider orientation="horizontal" />
        <Typography variant="caption" sx={{ mb: 0 }}>
          Structure
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#121926' }}>
          Delaware Series LLC
        </Typography>
      </Box>
    </Card>

    <Card className="founder-card">
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#121926', mb: '20px' }}>
          Name
        </Typography>
        <Divider orientation="horizontal" />
        <Typography variant="caption" sx={{ mb: 0 }}>
          On-Chain name
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#121926' }}>
          Netbee DAO
        </Typography>
        <Typography variant="subtitle1" sx={{ display: 'flex', fontWeight: 600, mt: '16px', color: '#B54708' }}>
          <AlertIcon stroke="#B54708" sx={{ fill: '#fff', mr: '14px' }} /> DAO name cannot be changed later.
        </Typography>
        <Divider orientation="horizontal" sx={{ mt: '8px !important' }} />
        <Typography variant="caption" sx={{ mb: 0 }}>
          Token symbol
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#121926' }}>
          NBE
        </Typography>
        <Typography variant="subtitle1" sx={{ display: 'flex', fontWeight: 600, mt: '16px', color: '#B54708' }}>
          <AlertIcon stroke="#B54708" sx={{ fill: '#fff', mr: '14px' }} /> DAO Symbol cannot be changed later.
        </Typography>
        <Divider orientation="horizontal" sx={{ mt: '8px !important' }} />
        <Typography variant="caption" sx={{ mb: 0 }}>
          Deploying on
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#121926' }}>
          Arbitrum
        </Typography>
      </Box>
    </Card>

    <Card className="founder-card">
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#121926', mb: '20px' }}>
          Governance
        </Typography>
        <Divider orientation="horizontal" />
        <Typography variant="caption" sx={{ mb: 0 }}>
          Voting Period
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#121926' }}>
          10 minutes
        </Typography>
        <Divider orientation="horizontal" />
        <Typography variant="caption" sx={{ mb: 0 }}>
          Quorum
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#121926' }}>
          20%
        </Typography>
        <Divider orientation="horizontal" />
        <Typography variant="caption" sx={{ mb: 0 }}>
          Approval Needed
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#121926' }}>
          60%
        </Typography>
      </Box>
    </Card>

    <Card className="founder-card">
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#121926', mb: '20px' }}>
          Token Features
        </Typography>
        <Divider orientation="horizontal" />
        <Typography variant="subtitle1" sx={{ mb: '16px', color: '#121926' }}>
          Redemption
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#121926' }}>
          Transferrable
        </Typography>
      </Box>
    </Card>
  </>
)

export default Confirmation
