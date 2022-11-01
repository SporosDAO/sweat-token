import { HourglassDisabled, HourglassTop, Launch } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

export default function ProposalCard(props: any) {
  const { chainId, daoId } = useParams()
  const { proposal } = props
  const {
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
    dao
  } = proposal
  const { votingPeriod } = dao
  // votes {
  //   voter
  //   vote
  //   weight
  // }
  const deadline = new Date()
  deadline.setTime((votingStarts + votingPeriod) * 1000)
  const deadlineString = deadline.toUTCString()
  const isExpired = deadline < new Date()

  return (
    <Card sx={{ margin: '8px', width: '48.5%' }} raised={true}>
      <CardContent>
        {/* <Typography>#{proposal.serial}</Typography> */}
        <Typography gutterBottom>{description}</Typography>
        <Typography color="text.secondary" gutterBottom>
          Proposer: {proposer}
        </Typography>
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
        <Typography color="text.secondary" gutterBottom>
          Status: {status ? 'PASSED' : 'NOT PASSED'}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          creationTime: {creationTime}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          votingStarts: {votingStarts}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          votingPeriod: {votingPeriod}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Voting Deadline: {deadlineString}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        {isExpired ? (
          <Button disabled variant="text" endIcon={<HourglassDisabled />}>
            Expired
          </Button>
        ) : (
          <Button variant="text" endIcon={<HourglassTop />} color="success">
            Active
          </Button>
        )}
        <Button
          variant="text"
          endIcon={<Launch />}
          href={`https://app.kali.gg/daos/${chainId}/${daoId}`}
          rel="noopener"
          target="_blank"
        >
          Kali
        </Button>
      </CardActions>
    </Card>
  )
}
