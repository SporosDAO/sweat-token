import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { FormikValues, FormikHandlers } from 'formik'

import Header from '../components/Header'
import { colors } from '../../../theme/colorPalette'

const Founder: React.FC<Partial<FormikValues & FormikHandlers>> = ({ values, handleChange }) => {
  const [noOfFounderCards, setNoOfFoundCards] = React.useState<number>(1)
  return (
    <>
      <Header title="Founder" subtitle="Provide information for founder(s) below." />
      {Array(noOfFounderCards)
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
                value={values.address}
                onChange={handleChange}
                helperText="Enter the wallet address you want to use to deploy the LLC."
              />
            </Box>
            <Box mt="16px">
              <TextField
                fullWidth
                type="text"
                name="initial-tokens"
                label="Initial Tokens"
                placeholder="1000"
                value={values.initialTokens}
                onChange={handleChange}
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
                value={values.email}
                onChange={handleChange}
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
      {noOfFounderCards < 5 && (
        <Button
          size="small"
          color="secondary"
          variant="contained"
          onClick={() => setNoOfFoundCards((noOfFounderCards) => (noOfFounderCards += 1))}
          startIcon={<img src="/icons/plus-circle.svg" alt="Plus Circle Icon" />}
        >
          Add a founder
        </Button>
      )}
    </>
  )
}

export default Founder
