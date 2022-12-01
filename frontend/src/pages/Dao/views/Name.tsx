import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

import Header from '../components/Header'

const Name: React.FC<any> = (props) => (
  <>
    <Header title="Name" subtitle="Tell us the name of your company." />
    <Box>
      <TextField
        fullWidth
        type="text"
        label="On-Chain name"
        error={!!props?.formState?.errors.name}
        placeholder="Pick a name"
        {...props?.register('name', { required: true })}
        helperText={
          <>
            {props?.formState?.errors.name && props?.formState?.errors.name.type === 'required'
              ? 'You need to pick the company name in order to continue.'
              : "This will be your company's on-chain name"}
          </>
        }
      />
    </Box>
    <Box mt="32px">
      <TextField
        fullWidth
        type="text"
        label="Token Symbol"
        error={!!props?.formState?.errors.symbol}
        placeholder="ex: SPR"
        {...props?.register('symbol', { required: true })}
        helperText={
          <>
            {props?.formState?.errors.symbol && props?.formState?.errors.symbol.type === 'required'
              ? 'You need to pick a token symbol in order to continue.'
              : 'This will be used as your token symbol.'}
          </>
        }
      />
    </Box>
  </>
)

export default Name
