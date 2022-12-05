import { CircularProgress, List } from '@mui/material'
import { Box } from '@mui/system'
import { useParams } from 'react-router-dom'
import ContentBlock from '../../components/ContentBlock'
import LoadingError from '../../components/LoadingError'
import { useGetPeople } from '../../graph/getPeople'
import PersonCard from './components/PersonCard'

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
        <LoadingError />
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
