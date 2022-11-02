import { HourglassDisabled, HourglassTop, Launch, ThumbDown, ThumbUp } from '@mui/icons-material'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  CircularProgressProps,
  Grid,
  CardActionArea
} from '@mui/material'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'
import { ethers } from 'ethers'
import { useLocation, useParams } from 'react-router-dom'
import { chain, useEnsAvatar, useEnsName } from 'wagmi'
import { useNavigate } from 'react-router-dom'

export default function ProposalCard(props: any) {
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

  function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    )
  }

  function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Card sx={{ margin: '8px', width: '48.5%' }} raised={true}>
      <CardActionArea
        data-testid={`proposals-link-${serial}`}
        onClick={() => {
          navigate(`./${serial}`)
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
            Proposal Type: {proposalType}
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
            </Box>
          ) : (
            <></>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        {isExpired ? (
          <Button disabled variant="text" endIcon={<HourglassDisabled />}>
            Closed
          </Button>
        ) : (
          <Button variant="text" endIcon={<HourglassTop />} color="success">
            Active
          </Button>
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
