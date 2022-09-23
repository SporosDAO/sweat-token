import React from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Name from './views/Name'
import Founder from './views/Founder'
import Payment from './views/Payment'
import Structure from './views/Structure'
import Confirmation from './views/Confirmation'
import { DaoLayout } from '../../layout/dao-layout'

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`
})

const TabPanel = ({ children, value, index, ...rest }: any) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...rest}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
)

const CreateDao: React.FC = () => {
  const [value, setValue] = React.useState(1)
  return (
    <DaoLayout>
      <Grid container>
        <Grid item md={3}>
          <Tabs
            value={value}
            sx={{ border: 'none' }}
            onChange={(_, value: number) => setValue(value)}
            orientation="vertical"
            aria-label="scrollable force tabs example"
          >
            <Tab label="Structure" {...a11yProps(0)} />
            <Tab label="Name" {...a11yProps(1)} />
            <Tab label="Founder" {...a11yProps(2)} />
            <Tab label="Confirmation" {...a11yProps(3)} />
            <Tab label="Payment" {...a11yProps(4)} />
          </Tabs>
        </Grid>
        <Grid item md={9}>
          <TabPanel value={value} index={0}>
            <Structure />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Name />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Founder />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Confirmation />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <Payment />
          </TabPanel>
        </Grid>
      </Grid>
      <Box sx={{ maxWidth: '50%' }}>
        {value === 1 && (
          <>
            <Box sx={{ mb: '32px' }}>
              <Typography component="div" variant="title" sx={{ mb: '8px' }}>
                What is an on-chain name?
              </Typography>
              <Typography variant="subtitle1">
                This is the name blockchain explorers such as arbiscan will use to represent your DAO.
              </Typography>
            </Box>
            <Box sx={{ mb: '32px' }}>
              <Typography component="div" variant="title" sx={{ mb: '8px' }}>
                Can I change my on-chain name or token symbol later?
              </Typography>
              <Typography variant="subtitle1">
                No. You will not be able to change your on-chain name nor token symbol after you deploy your DAO.
              </Typography>
            </Box>
            <Box>
              <Typography component="div" variant="title" sx={{ mb: '8px' }}>
                What will be my company's legal name?
              </Typography>
              <Typography variant="subtitle1">
                The actual name of your LLC will be "Ricardian LLC, [chainId: RicardianId]" as a Series LLC under Kali's
                Master Ricardian LLC.
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: '16px' }}>
                You will need to register a trade name with the state of Delaware if you want to do business with a
                different name off-chain.
              </Typography>
            </Box>
          </>
        )}
        {value === 2 && (
          <>
            <Box sx={{ mb: '32px' }}>
              <Typography component="div" variant="title" sx={{ mb: '8px' }}>
                Can I launch a DAO with more than one founder?
              </Typography>
              <Typography variant="subtitle1">
                Yes. You can add up to 5 number of founders when you launch your DAO.
              </Typography>
            </Box>
            <Box>
              <Typography component="div" variant="title" sx={{ mb: '8px' }}>
                Why do you need my email address?
              </Typography>
              <Typography variant="subtitle1">
                We only use your email to communicate directly with you. We do not share your email with any third
                parties.{' '}
              </Typography>
            </Box>
          </>
        )}
        {value === 4 && (
          <>
            <Box sx={{ mb: '32px' }}>
              <Typography component="div" variant="title" sx={{ mb: '8px' }}>
                What payment methods do you accept?
              </Typography>
              <Typography variant="subtitle1">Sporos only accepts payment in USDC or DAI.</Typography>
            </Box>
            <Box sx={{ mb: '32px' }}>
              <Typography component="div" variant="title" sx={{ mb: '8px' }}>
                Where do you accept payment?
              </Typography>
              <Typography variant="subtitle1">
                The Sporos treasury is on Arbitrum, so we are{' '}
                <Box component="span" sx={{ color: '#121926' }}>
                  only able to accept payment on Arbitrum.
                </Box>
              </Typography>
            </Box>
            <Box>
              <Typography component="div" variant="title" sx={{ mb: '8px' }}>
                Can I get a refund?
              </Typography>
              <Typography variant="subtitle1">
                Because your LLC is instantly created and minted on-chain once you pay and deploy, we are unable to
                provide a refund. However, we are more than happy to provide help and support for any of your Sporos
                related needs.
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </DaoLayout>
  )
}

export default CreateDao
