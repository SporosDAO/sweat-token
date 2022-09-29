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
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip arrow title={<Typography variant="caption">Name tooltip text</Typography>}>
                <img src="/icons/help-icon.svg" alt="Help Tooltip Icon" style={{ cursor: 'pointer', fill: 'none' }} />
              </Tooltip>
            </InputAdornment>
          )
        }}
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
