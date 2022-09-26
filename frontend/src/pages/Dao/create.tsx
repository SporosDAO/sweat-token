import React from 'react'
import Nope from 'nope-validator'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Formik } from 'formik'

import Name from './views/Name'
import Founder from './views/Founder'
import Payment from './views/Payment'
import Structure from './views/Structure'
import Confirmation from './views/Confirmation'
import { DaoLayout } from '../../layout/dao-layout'
import { ArrowRight, HelpIcon } from '../../components/Icons'
import { AnchorLink } from './components/AnchorLink'

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
    {value === index && <Box>{children}</Box>}
  </div>
)

const schema: any = Nope.object().shape({
  name: Nope.string().min(5, 'Too Short!').max(50, 'Too Long!').required('Required'),
  symbol: Nope.string().min(2, 'Too Short!').max(10, 'Too Long!').required('Required')
})

const Create: React.FC = () => {
  const [value, setValue] = React.useState(1)
  return (
    // cleanup this check?
    <DaoLayout hideSidebarBackground={[0, 3].includes(value)}>
      <Grid container>
        <Grid item md={3}>
          <Tabs value={value} sx={{ border: 'none' }} orientation="vertical" aria-label="scrollable force tabs example">
            <Tab label="Structure" {...a11yProps(0)} />
            <Tab label="Name" {...a11yProps(1)} />
            <Tab label="Founder" {...a11yProps(2)} />
            <Tab label="Confirmation" {...a11yProps(3)} />
            <Tab label="Payment" {...a11yProps(4)} />
          </Tabs>
          <Box sx={{ position: 'fixed', bottom: '40px' }}>
            {/* @Keith - update this href (no link shown in figma) */}
            <AnchorLink href="https://medium.com/sporos-dao" sx={{ textDecoration: 'none' }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <HelpIcon sx={{ mt: '2px', fill: 'none', stroke: '#61787C', fontSize: '20px', mr: '6px' }} />
                Help &amp; Support
              </Typography>
            </AnchorLink>
          </Box>
        </Grid>
        <Grid item md={9} p={3}>
          <Formik
            // @Keith - May remove Formik and use React Context to handle this flow instead
            // @Keith - may wire up each tab to the router (not sure it's needed yet though as you)
            // shouldn't be able to advance to the next tab without completing the previous, so it
            // would probably serve no purpose?
            validateOnMount
            initialValues={{ name: '', symbol: '' }}
            validate={(values) => schema.validate(values)}
            onSubmit={(values) => console.log('ssss', values)}
          >
            {({ handleSubmit, ...formData }) => (
              <form onSubmit={handleSubmit}>
                <TabPanel value={value} index={0}>
                  <Structure />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Name {...formData} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <Founder {...formData} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <Confirmation {...formData} />
                </TabPanel>
                <TabPanel value={value} index={4}>
                  <Payment {...formData} />
                </TabPanel>
                <Box sx={{ my: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {value > 0 ? (
                    <Button
                      // check not on the first step & hide *
                      // @todo Keith - fix alignment of icon
                      style={{ height: '36px' }}
                      className="bridge-button"
                      startIcon={<ArrowRight sx={{ mt: '4px', transform: 'scaleX(-1)', stroke: 'black' }} />}
                      onClick={() => setValue((value) => (value -= 1))}
                    >
                      Back
                    </Button>
                  ) : (
                    <Box />
                  )}
                  {value < 4 && (
                    <Button
                      disabled={!formData.isValid}
                      // check not on the last step & hide
                      // @todo Keith - fix alignment of icon
                      style={{
                        height: '36px',
                        color: '#fff',
                        background: '#4AB733',
                        border: '1px solid #4CA30D'
                      }}
                      className="bridge-button"
                      endIcon={<ArrowRight sx={{ mt: '4px', stroke: 'white' }} />}
                      onClick={() => setValue((value) => (value += 1))}
                    >
                      Continue
                    </Button>
                  )}
                </Box>
              </form>
            )}
          </Formik>
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
                This is the name blockchain explorers such as arbiscan will use to represent your company.
              </Typography>
            </Box>
            <Box sx={{ mb: '32px' }}>
              <Typography component="div" variant="title" sx={{ mb: '8px' }}>
                Can I change my on-chain name or token symbol later?
              </Typography>
              <Typography variant="subtitle1">
                No. You will not be able to change your on-chain name nor token symbol after you deploy your LLC.
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
                parties.
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

export default Create
