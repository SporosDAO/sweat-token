import { Launch, MoreVert, ThumbDown, ThumbUp } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, Typography, Box, Grid, CardActionArea } from '@mui/material'
import { ethers } from 'ethers'
import { useLocation, useParams } from 'react-router-dom'
import { chain, useEnsAvatar, useEnsName } from 'wagmi'
import { useNavigate } from 'react-router-dom'
import CircularProgressWithLabel from '../../components/CircularProgressWithLabel'
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel'

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
    votingStarts,
    accounts,
    dao
  } = proposal || {}
  // console.debug({ dao })
  const { votingPeriod, quorum, token } = dao
  const { totalSupply } = token
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
  // console.debug({
  //   votesFor,
  //   votesForPercentage,
  //   votesTotal,
  //   totalSupplyFormatted,
  //   quorum,
  //   quorumVotesRequired,
  //   quorumProgress
  // })

  const ensNameResult = useEnsName({ address: proposer, chainId: chain.mainnet.id, cacheTime: 60_000 })
  const ensName = !ensNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''
  const ensAvatarResult = useEnsAvatar({ addressOrName: proposer, chainId: chain.mainnet.id, cacheTime: 60_000 })
  const ensAvatar = !ensAvatarResult.isError && !ensAvatarResult.isLoading ? ensAvatarResult.data : ''

  const navigate = useNavigate()

  const PM_CONTRACT = '0x9f0ad778385a2c688533958c6ada56f201ffc246'

  let decoratedProposalType = proposalType
  let knownProposalType = true

  if (proposalType === 'EXTENSION') {
    if (accounts?.length && accounts[0] === PM_CONTRACT) {
      decoratedProposalType = 'NEW PROJECT'
    } else {
      decoratedProposalType = 'UNKNOWN EXTENSION'
      knownProposalType = false
    }
  } else if (proposalType !== 'MINT') {
    decoratedProposalType = 'UKNOWN'
    knownProposalType = false
  }

  return (
    <Card sx={{ margin: '8px', width: '48.5%' }} raised={true}>
      <CardActionArea
        data-testid={`proposals-link-${serial}`}
        onClick={() => {
          navigate(`./${serial}`, { state: proposal })
        }}
      >
        <CardContent>
          <Typography>#{serial}</Typography>
          <Typography gutterBottom>{description}</Typography>
          <Typography color="text.secondary" gutterBottom>
            Proposer: {proposer}
          </Typography>
          <Typography variant="h5" component="div">
            {ensName}
          </Typography>
          <div>{ensAvatar}</div>
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
            Voting Deadline: {deadlineString}
          </Typography>
          {!isExpired && votes?.length ? (
            <Grid container spacing={2} minHeight={80}>
              <Grid display="flex" justifyContent="center" alignItems="center" sx={{ pl: 4 }}>
                <ThumbUp color="success" /> <CircularProgressWithLabel color="success" value={votesForPercentage} />
              </Grid>
              <Grid display="flex" justifyContent="center" alignItems="center" sx={{ pl: 4 }}>
                <ThumbDown color="error" /> <CircularProgressWithLabel color="error" value={100 - votesForPercentage} />
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
      </CardActionArea>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        {knownProposalType ? (
          <Button
            variant="text"
            endIcon={<MoreVert />}
            onClick={() => {
              navigate(`./${serial}`, { state: proposal })
            }}
          >
            Details
          </Button>
        ) : (
          <></>
        )}
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
  )
}
