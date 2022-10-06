import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

import Header from '../components/Header'
import { colors } from '../../../theme/colorPalette'
import { useFieldArray } from 'react-hook-form'

const Founder: React.FC<any> = (props) => {
  // const [noOfFounderCards, setNoOfFoundCards] = React.useState<number>(1)

  const { fields, append } = useFieldArray({
    control: props.control,
    name: 'founders'
  })

  React.useEffect(() => {
    if (fields.length === 0) {
      console.log('sdsdd', fields.length)
      append({ address: '', initialTokens: 0, email: '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Header title="Founder" subtitle="Provide information for founder(s) below." />
      {fields.map((item, index) => (
        <Card
          key={item.id}
          sx={{ mb: '24px', background: colors.gray[50], boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' }}
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
              {...props?.register(`founders.${index}.email`, { required: true })}
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
          </Box>
        </Card>
      ))}

      {/* {Array(noOfFounderCards)
        .fill(0)
        .map((_, key) => (
          <Card
            key={key}
            sx={{ mb: '24px', background: colors.gray[50], boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)' }}
          >
            <Box>
              <TextField
                fullWidth
                type="text"
                name="address"
                label="Address"
                placeholder="0xdC..."
                {...props?.register('address', { required: true, maxLength: 20 })}
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
                {...props?.register('initialTokens')}
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
                {...props?.register('email')}
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
            </Box>
          </Card>
        ))} */}
      {fields.length < 5 && (
        <Button
          size="small"
          color="secondary"
          variant="contained"
          // onClick={() => setNoOfFoundCards((noOfFounderCards) => (noOfFounderCards += 1))}
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
