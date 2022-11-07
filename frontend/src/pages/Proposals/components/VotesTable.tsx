import { Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'

import { ThumbUp, ThumbDown } from '@mui/icons-material'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[300]
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

export default function VotesTable(props: any): JSX.Element {
  const { votes } = props

  console.debug({ votes })

  return (
    <TableContainer component={Paper}>
      <Table data-testid={'votes-table'} size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>
              <Typography>Voter</Typography>
            </StyledTableCell>
            <StyledTableCell>
              <Typography>Tokens</Typography>
            </StyledTableCell>
            <StyledTableCell>
              <Typography>Vote</Typography>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {votes?.length ? (
            votes.map(({ voter, vote, weight }: any) => (
              <TableRow key={voter}>
                <StyledTableCell>
                  <Typography>{voter}</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography>{vote ? <ThumbUp color="success" /> : <ThumbDown color="error" />}</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography>{weight}</Typography>
                </StyledTableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <StyledTableCell>
                <Typography variant="body1">No votes yet.</Typography>
              </StyledTableCell>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}