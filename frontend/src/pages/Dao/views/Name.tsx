import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Header from '../components/Header'
import Input from '../components/Input'

const Name = () => (
  <>
    <Header title="Name" subtitle="Tell us the name of your DAO" />
    <Box>
      <Typography component="div" variant="label" sx={{ mb: '6px' }}>
        On-Chain name
      </Typography>
      <Input type="text" placeholder="Pick a name" />
      <Typography variant="caption">This will be your DAO's on-chain name.</Typography>
    </Box>
    <Box sx={{ mt: '32px' }}>
      <Typography component="div" variant="label" sx={{ mb: '6px' }}>
        Token Symbol
      </Typography>
      <Input type="text" placeholder="ex: SPR" />
      <Typography variant="caption">This will be used as your token symbol.</Typography>
    </Box>
  </>
)

export default Name
