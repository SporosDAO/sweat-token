import { Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'

import { ThumbUp, ThumbDown } from '@mui/icons-material'
import { useEnsName, chain } from 'wagmi'
import { ethers } from 'ethers'

function VoterRow(props: { voter: string; weight: number; vote: boolean }) {
  const { voter, weight, vote } = props
  const ensNameResult = useEnsName({ address: voter, chainId: chain.mainnet.id, cacheTime: 60_000 })
  const voterEnsName = !ensNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''
  let votingTokensFormatted: any = Number(ethers.utils.formatEther(weight))
  votingTokensFormatted = new Intl.NumberFormat().format(votingTokensFormatted)

  return (
    <TableRow key={voter}>
      <StyledTableCell>
        <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
          {voterEnsName}
        </Typography>
        <Typography variant="overline">{voter}</Typography>
      </StyledTableCell>
      <StyledTableCell>
        <Typography>{votingTokensFormatted}</Typography>
      </StyledTableCell>
      <StyledTableCell>
        <Typography>{vote ? <ThumbUp color="success" /> : <ThumbDown color="error" />}</Typography>
      </StyledTableCell>
    </TableRow>
  )
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[400]
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

export default function VotesTable(props: any): JSX.Element {
  const { votes } = props

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
            votes.map((vote: any) => <VoterRow key={vote.voter} {...vote} />)
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
