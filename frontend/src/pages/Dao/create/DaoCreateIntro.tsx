import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { useNavigate } from 'react-router-dom'
import { ActionDocLayout } from '../../../components/ActionDocLayout'
import { AnchorLink } from '../../../components/AnchorLink'
import { Avatar } from '@mui/material'
import { useTheme } from '@mui/material'
import { PeopleAltRounded, AttachMoneyRounded, ChevronRight, TrendingUp } from '@mui/icons-material'

export default function DaoCreateIntro() {
  const navigate = useNavigate()
  const { palette } = useTheme()

  return (
    <ActionDocLayout>
      <Box>
        <Typography variant="h4" mb="8px" letterSpacing="-0.02em">
          Launch Your Company in Minutes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb="24px">
          We make it easy to create a Delaware Series LLC for your project and start rewarding contributors with sweat
          equity tokens. It only takes a few minutes from start to finish.
        </Typography>
        <Grid item alignItems="center" sx={{ display: 'flex', gap: '24px' }}>
          <Button
            size="large"
            variant="contained"
            data-testid="letsgo-button"
            onClick={() => navigate(`./stepper/`)}
            endIcon={<ChevronRight />}
          >
            Let's go!
          </Button>
          <Typography variant="body1" color="text.secondary" fontStyle="italic" fontWeight={400}>
            Available only on Arbitrum.
          </Typography>
        </Grid>
        <Box mt="64px">
          <Typography variant="body1" color="text.secondary" fontWeight={600} mb="12px">
            Features that let you grow
          </Typography>
          <Typography variant="h4" mb="8px" letterSpacing="-0.02em">
            Everything You Need to Launch and Grow
          </Typography>
          <Typography variant="h6" mb="8px" letterSpacing="-0.02em">
            Supported by{' '}
            <Link href="https://www.lexdao.coop/" rel="noreferrer" target="_blank">
              Lex DAO
            </Link>{' '}
            and{' '}
            <Link href="https://www.kali.gg/" rel="noreferrer" target="_blank">
              Kali DAO
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Get simple yet powerful tools to help you manage your DAO.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supported by Kali DAO, LexDAO.
          </Typography>
          <Grid mt="64px" container spacing={0} columnSpacing={{ md: 2 }}>
            <Grid item md={4}>
              <Avatar sx={{ color: palette.primary.light, bgcolor: palette.action.hover }} alt="Governance Icon">
                <PeopleAltRounded fontSize="large" />
              </Avatar>
              <Typography variant="subtitle1" mt="20px" mb="8px">
                Governance
              </Typography>
              <Typography variant="body1" color="text.secondary" mb="8px">
                Full on-chain governance including customizable settings, such as voting periods, quorum requirements,
                and approval thresholds. Manage your business with complete transparency.
              </Typography>
            </Grid>
            <Grid item md={4}>
              <Avatar sx={{ color: palette.primary.light, bgcolor: palette.action.hover }} alt="Treasury Icon">
                <AttachMoneyRounded fontSize="large" />
              </Avatar>
              <Typography variant="subtitle1" mt="20px" mb="8px">
                Treasury
              </Typography>
              <Typography variant="body1" color="text.secondary" mb="8px">
                Fully on-chain treasury support and management, including ETH, ERC-20, NFT and ERC-1155. Whitelist
                assets for further customization such as ragequitting and payments.
              </Typography>
            </Grid>
            <Grid item md={4}>
              <Avatar
                sx={{ color: palette.primary.light, bgcolor: palette.action.hover }}
                alt="Sweat Equity Token Icon"
              >
                <TrendingUp fontSize="large" />
              </Avatar>
              <Typography variant="subtitle1" mt="20px" mb="8px">
                Sweat Equity Tokens (SETs)
              </Typography>
              <Typography variant="body1" color="text.secondary" mb="8px">
                Compensate contributors with your DAO's SETs which represent both financial and governance rights in
                your company. Design your own distribution system using our on-chain proposals and project management
                tools.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box maxWidth="50%">
        <Box mb="32px">
          <Typography variant="body1" mb="8px">
            What do I get with Sporos?
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Through KaliDAO, Sporos enables you to instantly create an on-chain Delaware LLC, as a "child" of the{' '}
            Ricardian <AnchorLink href="https://de.llc.ricardian.eth.limo/">Wrappr LLC.</AnchorLink>
          </Typography>
          <Typography variant="subtitle2" mt="16px" color="text.secondary">
            Effectively, each LLC has its own rights and liability protection, separate and apart from each other,
            enforced by Delaware law and under the terms of the{' '}
            <AnchorLink href="https://de.llc.ricardian.eth.limo/">LLC master operating agreement</AnchorLink>.
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" mt="16px">
            Learn more about{' '}
            <AnchorLink href="https://mirror.xyz/kalico.eth/PjwUyaJsHZIvJ3RfSMghcw_FS1ohrrQuXmD9XI5GJtk)">
              Series LLCs
            </AnchorLink>{' '}
            and <AnchorLink href="https://docs.kalidao.xyz/faq/#what-is-a-smart-contract">KaliDAO</AnchorLink>.
          </Typography>
        </Box>
        <Box mb="32px">
          <Typography variant="body1" mb="8px">
            When will my LLC be ready?
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Your LLC will be instantly created and deployed on-chain as soon as you complete this form.
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" mb="8px">
            How much does Sporos cost?
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Sporos charges a flat fee of $199 (paid in DAI or USDC) to form your LLC.
          </Typography>
        </Box>
      </Box>
    </ActionDocLayout>
  )
}
