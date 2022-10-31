import { Button, CircularProgress, List } from '@mui/material'
import { Box } from '@mui/system'
import { useParams } from 'react-router-dom'
import ContentBlock from '../../components/ContentBlock'
import { useGetPeople } from '../../graph/getPeople'
import PersonCard from './components/PersonCard'

/* eslint react-hooks/rules-of-hooks: 0 */

export default function Proposals() {
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
    <ContentBlock title="Proposals">
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
          {people && people.length ? (
            <List>
              {people.map((person: any) => (
                <PersonCard key={person.address} person={person} tokenTotalSupply={tokenTotalSupply} />
              ))}
            </List>
          ) : (
            <p>This DAO has no members yet.</p>
          )}
        </Box>
      )}
    </ContentBlock>
  )
}
