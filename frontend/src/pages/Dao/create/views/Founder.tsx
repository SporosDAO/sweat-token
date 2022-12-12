import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { ethers } from 'ethers'

import Header from '../../../../components/Header'
import { Alert, useTheme } from '@mui/material'
import { ErrorMessage } from '@hookform/error-message'
import EnsNameInfo from '../../../../components/EnsNameInfo'

const Founder: React.FC<any> = (props) => {
  const { fields, append } = useFieldArray({
    control: props.control,
    name: 'founders'
  })

  const isValidEmail = (email: string) =>
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )

  const { palette } = useTheme()
  const { formState, control, register } = useFormContext()

  return (
    <>
      <Header title="Founder" subtitle="Provide information for founder(s) below." />
      {fields.map((field, index) => (
        <Card
          key={field.id}
          sx={{ mb: '24px', background: palette.grey[50], boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' }}
        >
          <Box>
            <TextField
              fullWidth
              type="text"
              label="Address"
              data-testid="founder-address-input"
              placeholder="0xdC..."
              {...register(`founders.${index}.address`, {
                required: 'Founder address required.',
                validate: {
                  isValidEvmAddress: (v: string) => {
                    const isValidEvmAddress = ethers.utils.isAddress(v)
                    // console.debug({ isValidEvmAddress })
                    return isValidEvmAddress || 'Please enter a valid EVM address for the founder.'
                  }
                }
              })}
              helperText="Enter the wallet address you want to use to deploy the LLC."
            />
            <Controller
              control={control}
              name={`founders.${index}.address`}
              render={({ field: { value } }) => <EnsNameInfo address={value} />}
            />
            <ErrorMessage
              as={<Alert severity="error" />}
              errors={formState?.errors}
              name={`founders.${index}.address`}
            />
          </Box>
          <Box mt="16px">
            <TextField
              fullWidth
              type="number"
              label="Initial Tokens"
              data-testid="founder-tokens-input"
              placeholder="1000"
              {...register(`founders.${index}.initialTokens`, {
                required: 'Founder initial tokens required.',
                validate: { positiveNumber: (tokens: number) => tokens > 0 || 'Positive number of tokens required.' }
              })}
              helperText="The founder will start with this amount of member tokens."
            />
            <ErrorMessage
              as={<Alert severity="error" />}
              errors={formState?.errors}
              name={`founders.${index}.initialTokens`}
            />
          </Box>
          <Box mt="16px">
            <TextField
              fullWidth
              type="text"
              label="Email"
              data-testid="founder-email-input"
              placeholder="Enter founder email address"
              {...register(`founders.${index}.email`, {
                required: 'Founder email required.',
                validate: { isValid: (email: string) => isValidEmail(email) || 'Founder email address required.' }
              })}
              helperText="This email is for Sporos' use only and will not be made public."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src="/icons/mail-icon.svg"
                      alt="Mail Tooltip Icon"
                      style={{ cursor: 'pointer', fill: 'none' }}
                    />
                  </InputAdornment>
                )
              }}
            />
            <ErrorMessage as={<Alert severity="error" />} errors={formState?.errors} name={`founders.${index}.email`} />
          </Box>
        </Card>
      ))}
      {/* <>{console.log('props', props.formState.errors)}</> */}
      {fields.length < 5 && (
        <Button
          size="small"
          color="secondary"
          variant="contained"
          onClick={() => append({ address: '', initialTokens: 0, email: '' })}
          startIcon={<img src="/icons/plus-circle.svg" alt="Plus Circle Icon" />}
        >
          Add a founder
        </Button>
      )}
    </>
  )
}

export default Founder
