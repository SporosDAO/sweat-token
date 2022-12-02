import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { useFieldArray } from 'react-hook-form'

import Header from '../../components/Header'
import { useTheme } from '@mui/material'

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

  return (
    <>
      <Header title="Founder" subtitle="Provide information for founder(s) below." />
      {fields.map((item, index) => (
        <Card
          key={item.id}
          sx={{ mb: '24px', background: palette.grey[50], boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' }}
        >
          <Box>
            <TextField
              fullWidth
              type="text"
              name="address"
              label="Address"
              placeholder="0xdC..."
              {...props?.register(`founders.${index}.address`, { required: true })}
              helperText="Enter the wallet address you want to use to deploy the LLC."
            />
          </Box>
          <Box mt="16px">
            <TextField
              fullWidth
              type="number"
              name="initial-tokens"
              label="Initial Tokens"
              placeholder="1000"
              {...props?.register(`founders.${index}.initialTokens`, { required: true })}
              helperText="The founder will start with this amount of XYZ tokens."
            />
          </Box>
          <Box mt="16px">
            <TextField
              fullWidth
              type="text"
              name="email"
              label="Email"
              placeholder="Enter founder email address"
              error={!!props?.formState?.errors?.founders?.[index]?.email}
              {...props?.register(`founders.${index}.email`, {
                required: true,
                validate: { isValid: (email: string) => isValidEmail(email) }
              })}
              helperText={
                <>
                  {(props?.formState?.errors?.founders?.[index]?.email &&
                    props?.formState?.errors?.founders?.[index]?.email?.type === 'required') ||
                  props?.formState?.errors?.founders?.[index]?.email?.type === 'isValid'
                    ? 'You need to enter a valid email address to continue.'
                    : "This email is for Sporos' use only and will not be made public."}
                </>
              }
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
          </Box>
        </Card>
      ))}
      <>{console.log('props', props.formState.errors)}</>
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
