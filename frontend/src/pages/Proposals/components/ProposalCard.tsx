import { Card, CardContent, Typography, ListItem } from '@mui/material'

export default function ProposalCard(props: any) {
  const { proposal } = props

  console.debug({ proposal })

  return (
    <ListItem key={proposal.id}>
      <Card sx={{ minWidth: 400 }} raised>
        <CardContent>
          <Typography variant="h5" component="div" data-testid="proposal-serial">
            Proposal #: {proposal.serial}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Description: <span>{proposal.description}</span>
          </Typography>
        </CardContent>
      </Card>
    </ListItem>
  )
}
