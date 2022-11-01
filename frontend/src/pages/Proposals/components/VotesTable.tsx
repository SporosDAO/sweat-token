import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { ThumbUp, ThumbDown } from '@mui/icons-material'
export default function VotesTable(props: any) {
  const { votes } = props

  console.debug({ votes })

  return votes?.length ? (
    <TableContainer component={Paper}>
      <Table data-testid={'votes-table'}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography>Voter</Typography>
            </TableCell>
            <TableCell>
              <Typography>Vote</Typography>
            </TableCell>
            <TableCell>
              <Typography>Weight</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {votes.map(({ voter, vote, weight }: any) => (
            <TableRow key={voter}>
              <TableCell>
                <Typography>{voter}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{vote ? <ThumbUp color="success" /> : <ThumbDown color="error" />}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{weight}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Box>No votes yet.</Box>
  )
}
