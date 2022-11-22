import { Link, Card, CardContent, Typography, Box } from '@mui/material'
import { ethers } from 'ethers'
import { useLocation, useParams } from 'react-router-dom'
import { chain, useEnsName } from 'wagmi'
import ContentBlock from '../../components/ContentBlock'
import ReactMarkdown from 'react-markdown'
import { AbiCoder } from 'ethers/lib/utils'
import VotesTable from './components/VotesTable'
import LabeledValue from '../../components/LabeledValue'
import VoteSummaryCard from './components/VoteSummaryCard'
import { useGetProposal } from '../../graph/getProposals'
import { addresses } from '../../constants/addresses'

export default function ProposalDetails() {
  const { chainId, daoId, serial } = useParams()
  const cid = Number(chainId)
  const location = useLocation()
  console.debug({ location })
  const { isReadyToProcessImmediately } = (location?.state as any) || {}

  // fetch fresh proposal data every few seconds
  const { data: proposal } = useGetProposal({
    chainId: cid,
    daoAddress: daoId,
    proposalSerial: Number(serial),
    queryOptions: {
      // Refetch proposal data every 5 seconds (in case there were any new votes)
      refetchInterval: 5000
    }
  })

  if (proposal) {
    proposal.isReadyToProcessImmediately = isReadyToProcessImmediately
  }

  console.debug({ proposal })

  const { proposer, proposalType, votes, accounts, payloads, dao } = proposal || {}
  const { token } = dao || {}
  const { symbol } = token || {}

  const ensNameResult = useEnsName({ address: proposer, chainId: chain.mainnet.id, cacheTime: 60_000 })
  const ensName = !ensNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''

  const PM_CONTRACT = addresses[cid]['extensions']['projectmanagement']

  let isProjectProposal = false

  if (proposalType === 'EXTENSION' && accounts?.length && accounts[0] === PM_CONTRACT) {
    isProjectProposal = true
  }

  console.log({ proposalType })

  let manager, budgetE18, dateInSecs, goalString

  try {
    const abiCoder: AbiCoder = ethers.utils.defaultAbiCoder as AbiCoder
    ;[, manager, budgetE18, dateInSecs, goalString] = payloads?.length
      ? abiCoder.decode(['uint256', 'address', 'uint256', 'uint256', 'string'], payloads[0])
      : []
  } catch (e) {
    console.error('Error while encoding project proposal', e)
  }
  const projectDeadline = new Date(dateInSecs * 1000).toLocaleString()
  const goals = goalString ? JSON.parse(goalString) : []
  const { goalTitle, goalDescription, goalLink } = goals[0] || {}
  let budget = budgetE18 ? ethers.utils.formatEther(budgetE18) : 0
  budget = new Intl.NumberFormat().format(Number(budget))

  const managerEnsNameResult = useEnsName({ address: proposer, chainId: chain.mainnet.id, cacheTime: 60_000 })
  const managerEnsName = !managerEnsNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''

  return isProjectProposal ? (
    <ContentBlock title={`Project Management`}>
      <Box display="flex" flexWrap={'wrap'}>
        <Card sx={{ margin: '8px' }}>
          <CardContent>
            <Typography color="subtitle1">Proposal #{serial}</Typography>
            <Typography variant="h4" color="accent">
              {goalTitle}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              By {proposer}
            </Typography>
            <Typography color="text.secondary">{ensName}</Typography>
            <LabeledValue data-testid="manager" label="Manager">
              {manager} {managerEnsName}
            </LabeledValue>
            <LabeledValue data-testid="budget" label="Budget">
              {budget} {symbol}
            </LabeledValue>
            <LabeledValue data-testid="project-deadline" label="Project Deadline">
              {projectDeadline}
            </LabeledValue>
            <LabeledValue data-testid="project-description" label="Project Description">
              <ReactMarkdown>{goalDescription}</ReactMarkdown>
            </LabeledValue>
            <LabeledValue data-testid="project-link" label="Progress Tracking">
              <Link href="{goalLink}">{goalLink}</Link>
            </LabeledValue>
          </CardContent>
        </Card>
        <VoteSummaryCard data-testid="vote-summary" proposal={proposal} />
      </Box>
      <Box display="flex" flexWrap={'wrap'} sx={{ margin: '8px' }}>
        <VotesTable data-testid="votes-table" votes={votes} />
      </Box>
    </ContentBlock>
  ) : (
    <Box display="flex" flexWrap={'wrap'} sx={{ margin: '8px' }}>
      <Typography color="error.main">
        Proposal type {proposalType} not supported. Please try Kali DAO or another front end.
      </Typography>
    </Box>
  )
}
