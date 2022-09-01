import { Button, CircularProgress, List } from '@mui/material'
import { Box } from '@mui/system'
import { useParams } from 'react-router-dom'
import ContentBlock from '../../components/ContentBlock'
import { useGetPeople } from '../../graph/getPeople'
import PersonCard from './components/PersonCard'

/* eslint react-hooks/rules-of-hooks: 0 */

export default function People() {
  const { chainId, daoId } = useParams()

  const { data, error, isLoading, isSuccess } = useGetPeople(chainId, daoId)
  let people: any[] = []
  let tokenTotalSupply = 0
  if (isSuccess) {
    people = data.data.daos[0]['members']
    tokenTotalSupply = data.data.daos[0]['token']['totalSupply']
  }
  return (
    <ContentBlock title="People">
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Box>
          Failed to load data.{' '}
          <Button
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
