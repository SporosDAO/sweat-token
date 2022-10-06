import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import { FormikValues, FormikHandlers } from 'formik'

import Header from '../components/Header'

const Name: React.FC<Partial<FormikValues & FormikHandlers>> = ({ values, handleChange }) => (
  <>
    <Header title="Name" subtitle="Tell us the name of your company." />
    <Box>
      <TextField
        fullWidth
        type="text"
        name="name"
        label="On-Chain name"
        value={values.name}
        onChange={handleChange}
        placeholder="Pick a name"
        helperText="This will be your company's on-chain name."
      />
    </Box>
    <Box mt="32px">
      <TextField
        fullWidth
        type="text"
        name="symbol"
        label="Token Symbol"
        value={values.symbol}
        onChange={handleChange}
        placeholder="ex: SPR"
        helperText="This will be used as your token symbol."
      />
    </Box>
  </>
)

export default Name
