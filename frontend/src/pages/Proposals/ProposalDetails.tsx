import { Launch, ThumbDown, ThumbUp } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, Typography, Box, Grid } from '@mui/material'
import { ethers } from 'ethers'
import { useLocation, useParams } from 'react-router-dom'
import { chain, useEnsAvatar, useEnsName } from 'wagmi'
import CircularProgressWithLabel from '../../components/CircularProgressWithLabel'
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel'
import ContentBlock from '../../components/ContentBlock'
import ReactMarkdown from 'react-markdown'
import { AbiCoder } from 'ethers/lib/utils'

export default function ProposalDetails(props: any) {
  const { chainId, daoId } = useParams()
  const location = useLocation()
  const proposal = location?.state as any
  const {
    serial,
    proposer,
    proposalType,
    description,
    sponsor,
    sponsored,
    cancelled,
    status,
    votes,
    creationTime,
    votingStarts,
    accounts,
    payloads,
    dao
  } = proposal || {}
  console.debug({ proposal, chainId, daoId, serial, payloads, dao })
  const { votingPeriod, quorum, token } = dao
  const { totalSupply } = token
  const creationTimeString = new Date(Number(creationTime) * 1000).toUTCString()
  const votingStartsString = new Date(Number(votingStarts) * 1000).toUTCString()
  console.debug({ creationTime, creationTimeString, votingStarts, votingStartsString })
  const deadline = new Date((Number(votingStarts) + Number(votingPeriod)) * 1000)
  const deadlineString = deadline.toUTCString()
  const isExpired = deadline < new Date()
  const votesFor = votes?.reduce(
    (result: any, item: { vote: any; weight: any }) =>
      result + Number(item.vote ? ethers.utils.formatEther(item.weight) : 0),
    0
  )
  const votesTotal = votes?.reduce(
    (result: any, item: { vote: any; weight: any }) => result + Number(ethers.utils.formatEther(item.weight)),
    0
  )

  const votesForPercentage = votesTotal ? (votesFor * 100) / votesTotal : 0
  const totalSupplyFormatted = Number(ethers.utils.formatEther(totalSupply))
  const quorumVotesRequired = (quorum * totalSupplyFormatted) / 100
  const quorumProgress = votesTotal >= quorumVotesRequired ? 100 : (votesTotal * 100) / quorumVotesRequired

  const ensNameResult = useEnsName({ address: proposer, chainId: chain.mainnet.id, cacheTime: 60_000 })
  const ensName = !ensNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''
  const ensAvatarResult = useEnsAvatar({ addressOrName: proposer, chainId: chain.mainnet.id, cacheTime: 60_000 })
  const ensAvatar = !ensAvatarResult.isError && !ensAvatarResult.isLoading ? ensAvatarResult.data : ''

  const PM_CONTRACT = '0x9f0ad778385a2c688533958c6ada56f201ffc246'

  let decoratedProposalType = proposalType
  let knownProposalType = true
  let isProjectProposal = true

  if (proposalType === 'EXTENSION') {
    if (accounts?.length && accounts[0] === PM_CONTRACT) {
      decoratedProposalType = 'NEW PROJECT'
      isProjectProposal = true
    } else {
      decoratedProposalType = 'UNKNOWN EXTENSION'
      knownProposalType = false
    }
  } else if (proposalType !== 'MINT') {
    decoratedProposalType = 'UKNOWN'
    knownProposalType = false
  }

  let manager, budgetE18, dateInSecs, goalString

  try {
    const abiCoder: AbiCoder = ethers.utils.defaultAbiCoder as AbiCoder
    ;[, manager, budgetE18, dateInSecs, goalString] = abiCoder.decode(
      ['uint256', 'address', 'uint256', 'uint256', 'string'],
      payloads[0]
    )
  } catch (e) {
    console.error('Error while encoding project proposal', e)
  }
  const projectDeadline = new Date(dateInSecs * 1000).toUTCString()
  const goals = JSON.parse(goalString)
  const { goalTitle, goalDescription, goalLink } = goals[0] || {}
  const budget = ethers.utils.formatEther(budgetE18)
  console.debug({ goals, budget, deadline })

  const managerEnsNameResult = useEnsName({ address: proposer, chainId: chain.mainnet.id, cacheTime: 60_000 })
  const managerEnsName = !managerEnsNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''
  const managerEnsAvatarResult = useEnsAvatar({ addressOrName: proposer, chainId: chain.mainnet.id, cacheTime: 60_000 })
  const managerEnsAvatar = !managerEnsAvatarResult.isError && !ensAvatarResult.isLoading ? ensAvatarResult.data : ''

  return isProjectProposal ? (
    <ContentBlock title="Project Proposal Details">
      <Box display="flex" flexWrap={'wrap'}>
        <Card sx={{ margin: '8px' }}>
          <CardContent>
            <Typography>Proposal #{serial}</Typography>
            <Typography gutterBottom>{description}</Typography>
            <Typography color="text.secondary" gutterBottom>
              Proposer: {proposer}
            </Typography>
            <Typography variant="h5" component="div">
              {ensName}
            </Typography>
            <div>{ensAvatar}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h5">Project Information</Typography>
            <Typography>Manager: {manager}</Typography>
            <Typography variant="h5" component="div">
              {managerEnsName}
            </Typography>
            <Box>{managerEnsAvatar}</Box>
            <Typography>Budget: {budget}</Typography>
            <Typography>Submitted On: {creationTimeString}</Typography>
            <Typography>Voting Start Date: {votingStartsString}</Typography>
            <Typography>Deadline: {projectDeadline}</Typography>
            <Typography>Goal: {goalTitle}</Typography>
            <Typography>Project Description:</Typography>
            <ReactMarkdown>{goalDescription}</ReactMarkdown>
            <Typography>Progress Tracking: {goalLink}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ margin: '8px' }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Proposal Type: {decoratedProposalType}
            </Typography>
            {sponsor && (
              <Typography color="text.secondary" gutterBottom>
                Sponsor: {sponsor}
              </Typography>
            )}
            <Typography color="text.secondary" gutterBottom>
              {sponsored
                ? 'Submitted by a DAO member.'
                : 'NOT SPONSORED. Submitted by a non-member. Requires member sponsorship.'}
            </Typography>
            {cancelled && (
              <Typography color="text.secondary" gutterBottom>
                CANCELLED
              </Typography>
            )}
            <Typography color={status ? 'success.main' : 'text.secondary'} gutterBottom>
              {status ? 'PASSED' : 'NOT PASSED'}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Submitted on: {deadlineString}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Voting Deadline: {deadlineString}
            </Typography>
            {!isExpired && votes?.length ? (
              <Grid container spacing={2} minHeight={80}>
                <Grid display="flex" justifyContent="center" alignItems="center" sx={{ pl: 4 }}>
                  <ThumbUp color="success" /> <CircularProgressWithLabel color="success" value={votesForPercentage} />
                </Grid>
                <Grid display="flex" justifyContent="center" alignItems="center" sx={{ pl: 4 }}>
                  <ThumbDown color="error" />{' '}
                  <CircularProgressWithLabel color="error" value={100 - votesForPercentage} />
                </Grid>
              </Grid>
            ) : (
              <></>
            )}
            {!isExpired ? (
              <Box sx={{ width: '100%' }}>
                <LinearProgressWithLabel value={quorumProgress} />
                <Typography color="text.secondary" gutterBottom>
                  Quorum {quorumProgress < 100 ? 'Not Reached' : 'Reached'}
                </Typography>
                <Typography color="text.primary" gutterBottom>
                  ACTIVE
                </Typography>
              </Box>
            ) : (
              <Typography color="text.secondary" gutterBottom>
                EXPIRED
              </Typography>
            )}
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between' }}>
            <Box>
              <Button
                disabled={!knownProposalType || isExpired}
                endIcon={<ThumbUp />}
                onClick={() => {
                  // vote for transaction
                }}
              >
                Vote For
              </Button>
              <Button
                disabled={!knownProposalType || isExpired}
                endIcon={<ThumbDown />}
                onClick={() => {
                  // vote for transaction
                }}
              >
                Vote Against
              </Button>
            </Box>
            <Button
              variant="text"
              endIcon={<Launch />}
              href={`https://app.kali.gg/daos/${chainId}/${daoId}/proposals/${serial}`}
              rel="noopener"
              target="_blank"
            >
              Kali
            </Button>
          </CardActions>
        </Card>
      </Box>
    </ContentBlock>
  ) : (
    <></>
  )
}
