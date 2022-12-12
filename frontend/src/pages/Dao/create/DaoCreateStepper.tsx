import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTheme } from '@mui/material'
import { AddressZero } from '@ethersproject/constants'

import Name from './views/Name'
import Founder from './views/Founder'
import Settings from './views/Settings'
import Confirmation from './views/Confirmation'
import Payment from './views/Payment'
import { ActionDocLayout } from '../../../components/ActionDocLayout'
import { a11yProps, TabPanel } from '../../../components/TabPanel'
import { ArrowRight, HelpIcon } from '../../../components/Icons'
import { CreateDaoForm, prepareKaliDaoCell } from './createDaoHelper'
import FACTORY_ABI from '../../../abi/KaliDAOFactory.json'
import { useNetwork } from 'wagmi'
import { addresses } from '../../../constants/addresses'
import Web3SubmitDialog from '../../../components/Web3SubmitDialog'

enum View {
  Name,
  Founder,
  Settings,
  Confirmation,
  Payment
}

export default function DaoCreateStepper() {
  const formMethods = useForm<CreateDaoForm>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      symbol: '',
      terms: false,
      transferability: false,
      founders: [{ address: '', initialTokens: 0, email: '' }],
      voting: {
        period: { hours: 1 },
        quorum: 20,
        approval: 60
      }
    }
  })
  const { handleSubmit, formState } = formMethods
  const [activeView, setActiveView] = React.useState(View.Name)

  const { chain: activeChain } = useNetwork()
  // Web3SubmitDialog state vars
  const [dialogOpen, setDialogOpen] = useState(false)
  const [txInput, setTxInput] = useState({})

  const daoFactory = {
    addressOrName: activeChain?.id ? addresses[activeChain.id]['factory'] : AddressZero,
    chainId: activeChain?.id,
    contractInterface: FACTORY_ABI,
    functionName: 'deployKaliDAO'
  }

  const onSubmit: SubmitHandler<CreateDaoForm> = (formData) => {
    // console.log({ formData })
    const initArgs = prepareKaliDaoCell(formData)
    const txInput = {
      ...daoFactory,
      args: initArgs
    }
    console.log({ txInput })
    setTxInput(txInput)
    setDialogOpen(true)
  }

  const onDialogClose = async () => {
    setDialogOpen(false)
  }

  const { palette } = useTheme()

  return (
    <ActionDocLayout>
      <Grid container>
        <Grid item width="30%">
          <Tabs
            value={activeView}
            sx={{ border: 'none' }}
            orientation="vertical"
            aria-label="scrollable force tabs example"
            TabIndicatorProps={{ sx: { left: 0, backgroundColor: palette.primary.dark } }}
          >
            <Tab label="Name" {...a11yProps(View.Name)} sx={{ alignSelf: 'start' }} />
            <Tab label="Founder" {...a11yProps(View.Founder)} sx={{ alignSelf: 'start' }} />
            <Tab label="Settings" {...a11yProps(View.Settings)} sx={{ alignSelf: 'start' }} />
            <Tab label="Confirm" {...a11yProps(View.Confirmation)} sx={{ alignSelf: 'start' }} />
            <Tab label="Payment" {...a11yProps(View.Payment)} sx={{ alignSelf: 'start' }} />
          </Tabs>
          <Box sx={{ cursor: 'pointer', position: 'fixed', bottom: '40px' }}>
            <Typography variant="subtitle2" color={palette.grey[500]} display="flex" alignItems="center">
              <HelpIcon sx={{ mt: '2px', fill: 'none', stroke: '#61787C', fontSize: '20px', mr: '6px' }} />
              Help &amp; Support
            </Typography>
          </Box>
        </Grid>
        <Grid item width="70%" p={3}>
          <FormProvider {...formMethods}>
            <form>
              <TabPanel value={activeView} index={View.Name}>
                <Name />
              </TabPanel>
              <TabPanel value={activeView} index={View.Founder}>
                <Founder />
              </TabPanel>
              <TabPanel value={activeView} index={View.Settings}>
                <Settings />
              </TabPanel>
              <TabPanel value={activeView} index={View.Confirmation}>
                <Confirmation />
              </TabPanel>
              <TabPanel value={activeView} index={View.Payment}>
                <Payment onPay={handleSubmit(onSubmit)} />
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
                {activeView < Object.keys(View).length / 2 - 1 && (
                  <Button
                    size="small"
                    variant="contained"
                    data-testid="continue-button"
                    disabled={!formState.isValid}
                    endIcon={<ArrowRight sx={{ mt: '4px', stroke: 'white' }} />}
                    onClick={() => setActiveView((activeView) => (activeView += 1))}
                  >
                    Continue
                  </Button>
                )}
              </Box>
              {dialogOpen && (
                <Web3SubmitDialog open={dialogOpen} onClose={onDialogClose} txInput={txInput} hrefAfterSuccess="/" />
              )}
            </form>
          </FormProvider>
        </Grid>
      </Grid>
      <Box maxWidth="50%">
        {activeView === View.Name && (
          <>
            <Box mb="32px">
              <Typography variant="body1" mb="8px" fontWeight={500}>
                What is an on-chain name?
              </Typography>
              <Typography variant="subtitle2" color={palette.grey[500]}>
                This is the name blockchain explorers such as arbiscan will use to represent your company.
              </Typography>
            </Box>
            <Box sx={{ mb: '32px' }}>
              <Typography variant="body1" mb="8px" fontWeight={500}>
                Can I change my on-chain name or token symbol later?
              </Typography>
              <Typography variant="subtitle2" color={palette.grey[500]}>
                No. You will not be able to change your on-chain name nor token symbol after you deploy your LLC.
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" mb="8px" fontWeight={500}>
                What will be my company's legal name?
              </Typography>
              <Typography variant="subtitle2" color={palette.grey[500]}>
                The actual name of your LLC will be "Ricardian LLC, [chainId: RicardianId]" as a Series LLC under Kali's
                Master Ricardian LLC.
              </Typography>
              <Typography variant="subtitle2" color={palette.grey[500]} sx={{ mt: '16px' }}>
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
              <Typography variant="subtitle2" color={palette.grey[500]}>
                Yes. You can add up to 5 number of founders when you launch your DAO.
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" mb="8px" fontWeight={500}>
                Why do you need my email address?
              </Typography>
              <Typography variant="subtitle2" color={palette.grey[500]}>
                We only use your email to communicate directly with you. We do not share your email with any third
                parties.
              </Typography>
            </Box>
          </>
        )}
        {activeView === View.Settings && (
          <>
            <Box mb="32px">
              <Typography variant="body1" mb="8px" fontWeight={500}>
                What are governance settings?
              </Typography>
              <Typography variant="subtitle2" color={palette.grey[500]}>
                Governance settings determine how your company enforces decisions on-chain. Transparently and immutably.
              </Typography>
            </Box>
            <Box sx={{ mb: '32px' }}>
              <Typography variant="body1" mb="8px" fontWeight={500}>
                Can I change governance settings later?
              </Typography>
              <Typography variant="subtitle2" color={palette.grey[500]}>
                Yes. You can change your company governance settings later via on-chain proposal vote. However it is
                very important to choose your initial settings wisely. Any subsequent change of governance settings has
                to comply with the then current governance settings.
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
              <Typography variant="subtitle2" color={palette.grey[500]}>
                Sporos only accepts payment in USDC or DAI.
              </Typography>
            </Box>
            <Box mb="32px">
              <Typography variant="body1" mb="8px" fontWeight={500}>
                Where do you accept payment?
              </Typography>
              <Typography variant="subtitle2" color={palette.grey[500]}>
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
              <Typography variant="subtitle2" color={palette.grey[500]}>
                Because your LLC is instantly created and minted on-chain once you pay and deploy, we are unable to
                provide a refund. However, we are more than happy to provide help and support for any of your Sporos
                related needs.
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </ActionDocLayout>
  )
}
