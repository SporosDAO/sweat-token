import { ErrorMessage } from '@hookform/error-message'
import { Alert } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useParams } from 'react-router'
import { useGetDaoNames } from '../../../../graph/getDaoNames'

import Header from '../../../../components/Header'
import { useFormContext } from 'react-hook-form'

const Name: React.FC<any> = (props) => {
  const { chainId } = useParams()

  const { data: names } = useGetDaoNames(Number(chainId))

  const { formState, register } = useFormContext()

  // console.debug({ names, isLoading, isSuccess })

  function isUniqueDaoName(candidateDaoName: string) {
    return !names?.includes(candidateDaoName)
  }

  return (
    <>
      <Header title="Company Name" subtitle="Tell us the name of your company." />
      <Box>
        <TextField
          fullWidth
          type="text"
          label="On-Chain name"
          data-testid="daoname-input"
          error={!!formState?.errors.name}
          placeholder="Pick a name"
          {...register('name', {
            required: 'Company name required',
            validate: {
              uniqueName: (v: string) => isUniqueDaoName(v) || 'This name is already used. Try another name.'
            }
          })}
          helperText="This will be your company's on-chain name."
        />
        <ErrorMessage as={<Alert severity="error" />} errors={formState?.errors} name="name" />
      </Box>
      <Box mt="32px">
        <TextField
          fullWidth
          type="text"
          label="Token Symbol"
          data-testid="daosymbol-input"
          error={!!formState?.errors.symbol}
          placeholder="ex: SPR"
          {...register('symbol', {
            required: 'Company symbol required.',
            maxLength: {
              value: 11,
              message: 'DAO token symbol should be less than 11 characters. Usually 3-5.'
            }
          })}
          helperText="This will be used as your token symbol."
        />
        <ErrorMessage as={<Alert severity="error" />} errors={formState?.errors} name="symbol" />
      </Box>
    </>
  )
}

export default Name
