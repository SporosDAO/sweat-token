import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FormikValues, FormikHandlers } from 'formik'

import Header from '../components/Header'
import Input from '../components/Input'

const Name: React.FC<Partial<FormikValues & FormikHandlers>> = ({ values, handleChange }) => (
  <>
    <Header title="Name" subtitle="Tell us the name of your DAO" />
    <Box>
      <Typography component="div" variant="label" sx={{ mb: '6px' }}>
        On-Chain name
      </Typography>
      <Input placeholder="Pick a name" type="text" name="name" onChange={handleChange} value={values.name} />
      <Typography variant="caption">This will be your company's on-chain name.</Typography>
    </Box>
    <Box sx={{ mt: '32px' }}>
      <Typography component="div" variant="label" sx={{ mb: '6px' }}>
        Token Symbol
      </Typography>
      <Input placeholder="ex: SPR" type="text" name="symbol" onChange={handleChange} value={values.symbol} />
      <Typography variant="caption">This will be used as your token symbol.</Typography>
    </Box>
  </>
)

export default Name
