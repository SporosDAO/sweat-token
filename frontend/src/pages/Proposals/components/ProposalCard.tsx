import { Launch, MoreVert } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, Typography, Box, CardActionArea } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { addresses } from '../../../constants/addresses'

export default function ProposalCard(props: any) {
  const { chainId, daoId } = useParams()
  const { proposal } = props
  const { serial, proposer, proposalType, description, cancelled, status, votingStarts, accounts, dao } = proposal
  const { votingPeriod } = dao

  const deadline = new Date((Number(votingStarts) + Number(votingPeriod)) * 1000)
  const deadlineString = deadline.toUTCString()
  const isExpired = deadline < new Date()

  const navigate = useNavigate()

  const cid = Number(chainId)
  const pmAddress = addresses[cid]['extensions']['projectmanagement']

  let decoratedProposalType = proposalType
  let knownProposalType = true

  if (proposalType === 'EXTENSION') {
    if (accounts?.length && accounts[0] === pmAddress) {
      decoratedProposalType = 'NEW PROJECT'
    } else {
      decoratedProposalType = 'UNKNOWN EXTENSION'
      knownProposalType = false
    }
  } else if (proposalType !== 'MINT' && proposalType !== 'ESCAPE') {
    decoratedProposalType = 'UNKNOWN'
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
          <Typography gutterBottom>Proposal Type: {decoratedProposalType}</Typography>
          <Typography color="text.secondary" gutterBottom>
            Proposer: {proposer}
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
          {!isExpired ? (
            <Box sx={{ width: '100%' }}>
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
        <Button
          disabled={!knownProposalType}
          variant="text"
          endIcon={<MoreVert />}
          onClick={() => {
            navigate(`./${serial}`, { state: proposal })
          }}
        >
          Details
        </Button>
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
