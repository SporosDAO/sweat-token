import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

import { DaoLayout } from '../../layout/dao-layout'
import { AnchorLink } from './components/AnchorLink'
import { ArrowRight } from '../../components/Icons'

const DaoLanding: React.FC = () => {
  const navigate = useNavigate()
  return (
    <DaoLayout>
      <Box>
        <Typography variant="h1" sx={{ mb: '8px' }}>
          Launch Your LLC in Minutes
        </Typography>
        <Typography variant="body1" sx={{ mb: '24px' }}>
          We make it easy to create a Delaware Series LLC for your project and start rewarding contributors with sweat
          equity tokens. It only takes a few minutes from start to finish.
        </Typography>
        <Grid item alignItems="center" sx={{ display: 'flex', gap: '24px' }}>
          <Button onClick={() => navigate('/dao/create')} className="cta">
            Let's go!
            <img style={{ marginLeft: '6px' }} src="/icons/chevron-right.svg" alt="Chevron Right Icon" />
          </Button>
          <Typography variant="title" sx={{ fontStyle: 'italic', fontWeight: 400, color: '#697586' }}>
            Available only on Arbitrum.
          </Typography>
        </Grid>
        <Box sx={{ mt: '64px' }}>
          <Typography component="div" variant="title" sx={{ fontWeight: 600, mb: '12px', color: '#3B7C0F' }}>
            Features that let you grow
          </Typography>
          <Typography variant="h1" sx={{ mb: '8px' }}>
            Everything You Need to Launch and Grow
          </Typography>
          <Typography variant="body1">Get simple yet powerful tools to help you manage your DAO.</Typography>
          <Typography variant="body1">Supported by Kali DAO, LexDAO.</Typography>
          <Grid sx={{ mt: '64px' }} container spacing={0} columnSpacing={{ md: 2 }}>
            <Grid item md={4}>
              <img src="/icons/users.svg" alt="Governance Icon" />
              <Typography variant="body1" sx={{ mt: '20px', mb: '8px', color: '#121926', fontWeight: 500 }}>
                Governance
              </Typography>
              <Typography component="div" variant="title" sx={{ mb: '8px', color: '#697586' }}>
                Full on-chain governance including customizable settings, such as voting periods, quorum requirements,
                and approval thresholds. Manage your business with complete transparency.
              </Typography>
              <AnchorLink
                href="#/"
                sx={{ marginTop: '20px', display: 'flex', fontSize: '16px', textDecoration: 'none' }}
              >
                Learn More
                <ArrowRight sx={{ ml: '12px', stroke: '#3B7C0F' }} />
              </AnchorLink>
            </Grid>
            <Grid item md={4}>
              <img src="/icons/dollar.svg" alt="Treasury Icon" />
              <Typography variant="body1" sx={{ mt: '20px', mb: '8px', color: '#121926', fontWeight: 500 }}>
                Treasury
              </Typography>
              <Typography component="div" variant="title" sx={{ mb: '8px', color: '#697586' }}>
                Fully on-chain treasury support and management, including ETH, ERC-20, NFT and ERC-1155. Whitelist
                assets for further customization such as ragequitting and payments.
              </Typography>
              <AnchorLink
                href="#/"
                sx={{ marginTop: '20px', display: 'flex', fontSize: '16px', textDecoration: 'none' }}
              >
                Learn More
                <ArrowRight sx={{ ml: '12px', stroke: '#3B7C0F' }} />
              </AnchorLink>
            </Grid>
            <Grid item md={4}>
              <img src="/icons/zap.svg" alt="Sweat Equity Token Icon" />
              <Typography variant="body1" sx={{ mt: '20px', mb: '8px', color: '#121926', fontWeight: 500 }}>
                Sweat Equity Tokens (SETs)
              </Typography>
              <Typography component="div" variant="title" sx={{ mb: '8px', color: '#697586' }}>
                Compensate contributors with your DAO's SETs which represent both financial and governance rights in
                your company. Design your own distribution system using our on-chain proposals and project management
                tools.
              </Typography>
              <AnchorLink
                href="#/"
                sx={{ marginTop: '20px', display: 'flex', fontSize: '16px', textDecoration: 'none' }}
              >
                Learn More
                <ArrowRight sx={{ ml: '12px', stroke: '#3B7C0F' }} />
              </AnchorLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ maxWidth: '50%' }}>
        <Box sx={{ mb: '32px' }}>
          <Typography component="div" variant="title" sx={{ mb: '8px' }}>
            What do I get with Sporos?
          </Typography>
          <Typography variant="subtitle1">
            Through KaliDAO, Sporos enables you to instantly create an on-chain Delaware LLC, as a "child" of the{' '}
            <AnchorLink href="https://docs.kalidao.xyz/#kalico-ricardian-llc">KaliCo Ricardian Series LLC.</AnchorLink>
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: '16px' }}>
            Effectively, each LLC has its own rights and liability protection, separate and apart from each other,
            enforced by Delaware law and under the terms of the{' '}
            <AnchorLink href="https://gateway.pinata.cloud/ipfs/QmdHFNxtecmCNcTscWJqnA4AiASyk3SHCgKamugLHqR23i">
              LLC master operating agreement
            </AnchorLink>
            .
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: '16px' }}>
            Learn more about{' '}
            <AnchorLink href="https://mirror.xyz/kalico.eth/PjwUyaJsHZIvJ3RfSMghcw_FS1ohrrQuXmD9XI5GJtk)">
              Series LLCs
            </AnchorLink>{' '}
            and <AnchorLink href="https://docs.kalidao.xyz/faq/#what-is-a-smart-contract">KaliDAO</AnchorLink>.
          </Typography>
        </Box>
        <Box sx={{ mb: '32px' }}>
          <Typography component="div" variant="title" sx={{ mb: '8px' }}>
            When will my DAO be ready?
          </Typography>
          <Typography variant="subtitle1">
            Your DAO will be instantly created and deployed on-chain as soon as you complete this form.
          </Typography>
        </Box>
        <Box>
          <Typography component="div" variant="title" sx={{ mb: '8px' }}>
            How much does Sporos cost?
          </Typography>
          <Typography variant="subtitle1">
            Sporos charges a flat fee of $199 (paid in DAI or USDC) to form your LLC.
          </Typography>
        </Box>
      </Box>
    </DaoLayout>
  )
}

export default DaoLanding
