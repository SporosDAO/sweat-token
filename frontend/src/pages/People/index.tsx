import { Button, CircularProgress, TableHead, Table, TableCell, TableRow, TableBody } from '@mui/material'
import { Box } from '@mui/system'
import { useParams } from 'react-router-dom'
import ContentBlock from '../../components/ContentBlock'
import { useGetPeople } from '../../graph/getPeople'
import { ethers } from 'ethers'

/* eslint react-hooks/rules-of-hooks: 0 */

export default function People() {
  const { chainId, daoId } = useParams()
  const cid = Number(chainId)
  const { data, error, isLoading, isSuccess } = useGetPeople(cid, daoId)
  let people: any[] = []
  let tokenTotalSupply = 0
  if (isSuccess) {
    people = data.data.daos[0]['members']
    tokenTotalSupply = data.data.daos[0]['token']['totalSupply']
  }
  return (
    <ContentBlock title="People">
      {isLoading ? (
        <CircularProgress data-testid="progress-icon" />
      ) : error ? (
        <Box>
          Failed to load data.{' '}
          <Button
            data-testid="retry-btn"
            onClick={(e) => {
              e.preventDefault()
            }}
            aria-label="retry"
          >
            Retry
          </Button>
        </Box>
      ) : (
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Tokens</TableCell>
                <TableCell>Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {people?.map((person: any) => (
                <TableRow>
                  <TableCell>{person.address}</TableCell>
                  <TableCell>{ethers.utils.formatEther(person.shares)}</TableCell>
                  <TableCell>{((100 * person.shares) / tokenTotalSupply).toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </ContentBlock>
  )
}
