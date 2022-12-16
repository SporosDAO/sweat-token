import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { useFormContext } from 'react-hook-form'

import Header from '../../../../components/Header'
import { Alert, CardContent } from '@mui/material'
import { ErrorMessage } from '@hookform/error-message'

const Settings: React.FC<any> = (props) => {
  const { formState, register } = useFormContext()

  return (
    <>
      <Header title="Settings" subtitle="Provide settings for company governance." />
      <Card>
        <CardContent>
          <Box>
            <TextField
              fullWidth
              type="number"
              label="Voting Period"
              placeholder="1"
              {...register(`voting.period.hours`, {
                required: 'Voting period required.',
                // see KaliDAO contract checks:
                // https://github.com/kalidao/kali-contracts/blob/de721b483b04feba5c42b49b997d68e8ce4885dd/contracts/KaliDAO.sol#L160
                max: { value: 24 * 365, message: 'Voting period has to be less than 365 days.' },
                validate: {
                  positiveNumber: (v: any) => v > 0 || 'Voting period has to be a positive number.'
                }
              })}
              helperText="Time period proposals for your company will be live for."
              data-testid="voting-period-input"
              variant="filled"
              InputProps={{
                endAdornment: <InputAdornment position="end">hours</InputAdornment>
              }}
            />
            <ErrorMessage
              as={<Alert severity="error" />}
              errors={formState?.errors}
              name={'voting.period.hours'}
              data-testid="voting-period-error"
            />
          </Box>
          <Box mt="16px">
            <TextField
              fullWidth
              type="number"
              label="Voting Quorum"
              placeholder="20"
              {...register(`voting.quorum`, {
                required: 'Voting quorum threshold required.',
                min: { value: 1, message: 'Quorum percentage has to be a positive number.' },
                max: { value: 100, message: 'Quorum percentage has to be no greater than 100.' }
              })}
              helperText="Percentage of your LLC's tokens that need to vote on a proposal for it to be valid."
              data-testid="voting-quorum-input"
              variant="filled"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
            <ErrorMessage
              as={<Alert severity="error" />}
              errors={formState?.errors}
              name={'voting.quorum'}
              data-testid="voting-quorum-error"
            />
          </Box>
          <Box mt="16px">
            <TextField
              fullWidth
              type="number"
              label="Approval Needed"
              placeholder="60"
              helperText="Percentage of Yes-voting tokens for a proposal."
              {...register(`voting.approval`, {
                required: 'Approval threshold required.',
                min: { value: 51, message: 'Approval percentage has to be at least 51.' },
                max: { value: 100, message: 'Approval percentage has to be no greater than 100.' }
              })}
              data-testid="voting-approval-input"
              variant="filled"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
            <ErrorMessage
              as={<Alert severity="error" />}
              errors={formState?.errors}
              name={'voting.approval'}
              data-testid="voting-approval-error"
            />
          </Box>
        </CardContent>
      </Card>
      {/* <>{console.log('formState errors', formState.errors)}</> */}
    </>
  )
}

export default Settings
