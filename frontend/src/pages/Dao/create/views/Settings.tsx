import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { useFieldArray } from 'react-hook-form'

import Header from '../../components/Header'
import { useTheme } from '@mui/material'

const Settings: React.FC<any> = (props) => {
  const { fields } = useFieldArray({
    control: props.control,
    name: 'founders'
  })

  const { palette } = useTheme()

  console.debug({ fields })

  return (
    <>
      <Header title="Settings" subtitle="Provide settings for company governance." />
      {fields.map((item, index) => (
        <Card
          key={item.id}
          sx={{ mb: '24px', background: palette.grey[50], boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' }}
        >
          <Box>
            <TextField
              fullWidth
              type="number"
              name="votingPeriod"
              label="Voting Period"
              placeholder="10"
              {...props?.register(`voting.period.hours`, {
                required: true,
                min: { value: 1, message: 'Voting period has to be a positive number.' },
                // see KaliDAO contract checks:
                // https://github.com/kalidao/kali-contracts/blob/de721b483b04feba5c42b49b997d68e8ce4885dd/contracts/KaliDAO.sol#L160
                max: { value: 24 * 365, message: 'Voting period has to be less than 365 days.' }
              })}
              helperText="Time period proposals for your company will be live for."
              data-testid="voting-period-input"
              variant="filled"
              InputProps={{
                endAdornment: <InputAdornment position="end">hours</InputAdornment>
              }}
            />
          </Box>
          <Box mt="16px">
            <TextField
              fullWidth
              type="number"
              name="voting-quorum"
              label="Voting Quorum"
              placeholder="20"
              {...props?.register(`voting.quorum`, {
                required: true,
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
          </Box>
          <Box mt="16px">
            <TextField
              fullWidth
              type="number"
              name="voting-approval-input"
              label="Approval Needed"
              placeholder="60"
              helperText="Percentage of Yes-voting tokens for a proposal."
              {...props?.register(`voting.approval`, {
                required: true,
                min: { value: 51, message: 'Approval percentage has to be at least 51.' },
                max: { value: 100, message: 'Approval percentage has to be no greater than 100.' }
              })}
              data-testid="voting-approval-input"
              variant="filled"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Box>
        </Card>
      ))}
      <>{console.log('props', props.formState.errors)}</>
    </>
  )
}

export default Settings
