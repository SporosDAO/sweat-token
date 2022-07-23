import { Button, CircularProgress, List } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ContentBlock from '../../components/ContentBlock'
import { useGetPeople } from '../../graph/getPeople'
import PersonCard from './components/PersonCard'

export interface DaoPerson {
  address: string
  shares: number
}

export default function People() {
  const { chainId, daoId } = useParams()
  const { data, error, isLoading, isSuccess } = useGetPeople(chainId, daoId)

  const [people, setPeople] = useState<DaoPerson[]>()
  const [tokenTotalSupply, setTokenTotalSupply] = useState<number>(0)

  useEffect(() => {
    console.debug('useGetPeople', { data, error, isLoading, isSuccess })
    if (isSuccess) {
      setPeople(data.data.daos[0]['members'])
      setTokenTotalSupply(data.data.daos[0]['token']['totalSupply'])
    }
    console.debug({ people })
    console.debug({ tokenTotalSupply })
  }, [data, error, isLoading, isSuccess, people, tokenTotalSupply])
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
