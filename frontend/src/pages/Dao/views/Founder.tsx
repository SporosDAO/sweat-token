import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { FormikValues, FormikHandlers } from 'formik'

import Header from '../components/Header'
import Input from '../components/Input'

const Founder: React.FC<Partial<FormikValues & FormikHandlers>> = ({ values, handleChange }) => {
  const [noOfFounderCards, setNoOfFoundCards] = React.useState<number>(1)
  return (
    <>
      <Header title="Founder" subtitle="Provide information for founder(s) below." />
      {Array(noOfFounderCards)
        .fill(0)
        .map((_, key) => (
          <Card key={key} className="founder-card">
            <Box>
              <Typography component="div" variant="label" sx={{ mb: '6px' }}>
                Address
              </Typography>
              <Input type="text" placeholder="0xdC..." />
              <Typography variant="caption">Enter the wallet address you want to use to deploy the LLC.</Typography>
            </Box>
            <Box sx={{ mt: '16px' }}>
              <Typography component="div" variant="label" sx={{ mb: '6px' }}>
                Initial Tokens
              </Typography>
              <Input type="text" placeholder="1000" />
              <Typography variant="caption">The founder will start with this amount of XYZ tokens.</Typography>
            </Box>
            <Box sx={{ mt: '16px' }}>
              <Typography component="div" variant="label" sx={{ mb: '6px' }}>
                Email
              </Typography>
              <Input type="text" placeholder="Enter founder email address" />
              <Typography variant="caption">This email is for Sporos' use only and will not be made public.</Typography>
            </Box>
          </Card>
        ))}
      {noOfFounderCards < 5 && (
        <Button
          className="founder-button"
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
