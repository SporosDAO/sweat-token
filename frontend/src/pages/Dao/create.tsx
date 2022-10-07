import React from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useForm } from 'react-hook-form'

import Name from './views/Name'
import Terms from './views/Terms'
import Founder from './views/Founder'
import Payment from './views/Payment'
import Confirmation from './views/Confirmation'
import { colors } from '../../theme/colorPalette'
import { DaoLayout } from '../../layout/dao-layout'
import { a11yProps, TabPanel } from './components/TabPanel'
import { ArrowRight, HelpIcon } from '../../components/Icons'

enum View {
  Name,
  Founder,
  Confirmation,
  Terms,
  Payment
}

const Create: React.FC = () => {
  const { handleSubmit, ...formData } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      symbol: '',
      founders: [{ address: '', initialTokens: 0, email: '' }]
    }
  })
  const [activeView, setActiveView] = React.useState(View.Terms)
  const onSubmit = async (data: any) => console.log({ data })
  console.log('formState', formData)
  return (
    <DaoLayout hideSidebar={[View.Confirmation, View.Terms].includes(activeView)}>
      <Grid container>
        <Grid item width="30%">
          <Tabs
            value={activeView}
            sx={{ border: 'none' }}
            orientation="vertical"
            aria-label="scrollable force tabs example"
            TabIndicatorProps={{ sx: { left: 0, backgroundColor: colors.primary[600] } }}
          >
            <Tab label="Name" {...a11yProps(View.Name)} />
            <Tab label="Founder" {...a11yProps(View.Founder)} />
            <Tab label="Confirmation" {...a11yProps(View.Confirmation)} />
            <Tab label="Terms & conditions" {...a11yProps(View.Terms)} />
            <Tab label="Payment" {...a11yProps(View.Payment)} />
          </Tabs>
          <Box sx={{ cursor: 'pointer', position: 'fixed', bottom: '40px' }}>
            <Typography variant="subtitle2" color={colors.gray[500]} display="flex" alignItems="center">
              <HelpIcon sx={{ mt: '2px', fill: 'none', stroke: '#61787C', fontSize: '20px', mr: '6px' }} />
              Help &amp; Support
            </Typography>
          </Box>
        </Grid>
        <Grid item width="70%" p={3}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TabPanel value={activeView} index={View.Name}>
              <Name {...formData} />
            </TabPanel>
            <TabPanel value={activeView} index={View.Founder}>
              <Founder {...formData} />
            </TabPanel>
            <TabPanel value={activeView} index={View.Confirmation}>
              <Confirmation {...formData} />
            </TabPanel>
            <TabPanel value={activeView} index={View.Terms}>
              <Terms />
            </TabPanel>
            <TabPanel value={activeView} index={View.Payment}>
              <Payment />
            </TabPanel>
            <Box sx={{ my: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {activeView > 0 ? (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ArrowRight sx={{ mt: '4px', transform: 'scaleX(-1)', stroke: 'black' }} />}
                  onClick={() => setActiveView((activeView) => (activeView -= 1))}
                >
                  Back
                </Button>
              ) : (
                <Box />
              )}
              {activeView < 4 && (
                <Button
                  size="small"
                  variant="contained"
                  disabled={!formData.formState.isValid}
                  endIcon={<ArrowRight sx={{ mt: '4px', stroke: 'white' }} />}
                  onClick={() => setActiveView((activeView) => (activeView += 1))}
                >
                  Continue
                </Button>
              )}
            </Box>
          </form>
        </Grid>
      </Grid>
      <Box maxWidth="50%">
        {activeView === View.Name && (
          <>
            <Box mb="32px">
              <Typography variant="body1" mb="8px" fontWeight={500}>
                What is an on-chain name?
              </Typography>
              <Typography variant="subtitle2" color={colors.gray[500]}>
                This is the name blockchain explorers such as arbiscan will use to represent your company.
              </Typography>
            </Box>
            <Box sx={{ mb: '32px' }}>
              <Typography variant="body1" mb="8px" fontWeight={500}>
                Can I change my on-chain name or token symbol later?
              </Typography>
              <Typography variant="subtitle2" color={colors.gray[500]}>
                No. You will not be able to change your on-chain name nor token symbol after you deploy your LLC.
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" mb="8px" fontWeight={500}>
                What will be my company's legal name?
              </Typography>
              <Typography variant="subtitle2" color={colors.gray[500]}>
                The actual name of your LLC will be "Ricardian LLC, [chainId: RicardianId]" as a Series LLC under Kali's
                Master Ricardian LLC.
              </Typography>
              <Typography variant="subtitle2" color={colors.gray[500]} sx={{ mt: '16px' }}>
                You will need to register a trade name with the state of Delaware if you want to do business with a
                different name off-chain.
              </Typography>
            </Box>
          </>
        )}
        {activeView === View.Founder && (
          <>
            <Box mb="32px">
              <Typography variant="body1" mb="8px" fontWeight={500}>
                Can I launch a DAO with more than one founder?
              </Typography>
              <Typography variant="subtitle2" color={colors.gray[500]}>
                Yes. You can add up to 5 number of founders when you launch your DAO.
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" mb="8px" fontWeight={500}>
                Why do you need my email address?
              </Typography>
              <Typography variant="subtitle2" color={colors.gray[500]}>
                We only use your email to communicate directly with you. We do not share your email with any third
                parties.
              </Typography>
            </Box>
          </>
        )}
        {activeView === View.Payment && (
          <>
            <Box mb="32px">
              <Typography variant="body1" mb="8px" fontWeight={500}>
                What payment methods do you accept?
              </Typography>
              <Typography variant="subtitle2" color={colors.gray[500]}>
                Sporos only accepts payment in USDC or DAI.
              </Typography>
            </Box>
            <Box mb="32px">
              <Typography variant="body1" mb="8px" fontWeight={500}>
                Where do you accept payment?
              </Typography>
              <Typography variant="subtitle2" color={colors.gray[500]}>
                The Sporos treasury is on Arbitrum, so we are{' '}
                <Box component="span" color="#121926">
                  only able to accept payment on Arbitrum.
                </Box>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" mb="8px" fontWeight={500}>
                Can I get a refund?
              </Typography>
              <Typography variant="subtitle2" color={colors.gray[500]}>
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

export default Create