import { Launch, MoreVert } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, Typography, Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import LabeledValue from '../../../components/LabeledValue'
import { knownProposalType } from '../proposalHelpers'

export default function ProposalCard(props: any) {
  const { chainId, daoId } = useParams()
  const { proposal } = props
  const { serial, proposer, proposalType, description, cancelled, status, votingStarts, accounts, dao } = proposal
  const { votingPeriod } = dao

  const deadline = new Date((Number(votingStarts) + Number(votingPeriod)) * 1000)
  const deadlineString = deadline.toLocaleString()
  const isExpired = deadline < new Date()

  const navigate = useNavigate()

  const { isKnown, label: decoratedProposalType } = knownProposalType({ proposalType, accounts })

  return (
    <Card
      data-testid="proposal-card"
      sx={{ margin: '8px', width: '48.5%', display: 'flex', flexDirection: 'column' }}
      raised={true}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography data-testid="prop-serial">#{serial}</Typography>
        <Typography gutterBottom>{description}</Typography>
        <LabeledValue label="Proposal Type">{decoratedProposalType}</LabeledValue>
        <LabeledValue label="Proposer">{proposer}</LabeledValue>
        {cancelled && (
          <Typography color="text.secondary" gutterBottom>
            CANCELLED
          </Typography>
        )}
        <Typography color={status ? 'success.main' : 'text.secondary'} gutterBottom>
          {status ? 'PASSED' : 'NOT PASSED'}
        </Typography>
        <LabeledValue label="Voting Deadline">{deadlineString}</LabeledValue>
        {!isExpired ? (
          <Box sx={{ width: '100%' }}>
            <Typography color="text.primary" gutterBottom>
              VOTING OPEN
            </Typography>
          </Box>
        ) : (
          <Typography color="text.secondary" gutterBottom>
            VOTING CLOSED
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        {isKnown ? (
          <Button
            variant="text"
            data-testid="prop-details-button"
            endIcon={<MoreVert />}
            onClick={() => {
              navigate(`./${serial}`, { state: proposal })
            }}
          >
            Details
          </Button>
        ) : (
          <Button />
        )}
        <Button
          variant="text"
          color="secondary"
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
