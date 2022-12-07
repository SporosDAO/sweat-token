import { ErrorMessage } from '@hookform/error-message'
import { Alert } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useParams } from 'react-router'
import { useGetDaoNames } from '../../../../graph/getDaoNames'

import Header from '../../components/Header'

const Name: React.FC<any> = (props) => {
  const { chainId } = useParams()

  const { data: names, isLoading, isSuccess } = useGetDaoNames(Number(chainId))

  console.debug({ names, isLoading, isSuccess })

  function isUniqueDaoName(candidateDaoName: string) {
    return !names?.includes(candidateDaoName)
  }

  return (
    <>
      <Header title="Name" subtitle="Tell us the name of your company." />
      <Box>
        <TextField
          fullWidth
          type="text"
          label="On-Chain name"
          error={!!props?.formState?.errors.name}
          placeholder="Pick a name"
          {...props?.register('name', {
            required: true,
            validate: {
              uniqueName: (v: string) => isUniqueDaoName(v) || 'This name is already used. Try another name.'
            }
          })}
          helperText="This will be your company's on-chain name"
        />
        <ErrorMessage as={<Alert severity="error" />} errors={props?.formState?.errors} name="name" />
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
}

export default Name
