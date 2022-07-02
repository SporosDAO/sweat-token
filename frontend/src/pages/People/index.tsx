import { Button, CircularProgress, Grid, Card, CardContent, Typography, List, ListItem } from '@mui/material'
import { Box } from '@mui/system'
import { useParams } from 'react-router-dom'
import ContentBlock from '../../components/ContentBlock'
import { getPeople } from '../../graph/getPeople'
import { useQuery } from 'react-query'
import { useEnsName, useEnsAvatar } from 'wagmi'

/* eslint react-hooks/rules-of-hooks: 0 */

export function useGetPeople(chainId: string, userAddress: string) {
  return useQuery(['getPeople', chainId, userAddress], async () => {
    const data = await getPeople(chainId, userAddress)
    return data
  })
}

export default function People() {
  const { chainId, daoId } = useParams()

  const { data, error, isLoading, isSuccess } = useGetPeople(chainId!, daoId!)
  const people = data?.data.daos[0]['members']
  const tokenTotalSupply = data?.data.daos[0]['token']['totalSupply']
  console.debug({ people })
  console.debug({ tokenTotalSupply })

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
                <ListItem key={person['address']}>
                  <Card sx={{ minWidth: 400 }} raised={true}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {useEnsName({ address: person['address'], chainId: Number(1), cacheTime: 60_000 }).data}
                      </Typography>
                      <div>
                        {useEnsAvatar({ address: person['address'], chainId: Number(1), cacheTime: 60_000 }).data}
                      </div>
                      <Typography>{person['address']}</Typography>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        stake: {((100 * person['shares']) / tokenTotalSupply).toFixed(2)}%
                      </Typography>
                    </CardContent>
                  </Card>
                </ListItem>
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
