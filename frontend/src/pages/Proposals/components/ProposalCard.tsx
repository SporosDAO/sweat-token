import { TableRow, TableCell } from '@mui/material'

export default function ProposalCard(props: any) {
  const { proposal } = props

  // console.debug({ proposal })

  return (
    <TableRow key={proposal.id}>
      <TableCell>{proposal.serial}</TableCell>
      <TableCell>{proposal.description}</TableCell>
    </TableRow>
  )
}
