import { Button, CircularProgress, Grid, Card, CardContent, Typography, List, ListItem } from '@mui/material'
import { Box } from '@mui/system'
import { useParams } from 'react-router-dom'
import ContentBlock from '../../components/ContentBlock'
import { getPeople } from '../../graph/getPeople'
import { useQuery } from 'react-query'
import { useEnsName, useEnsAvatar } from 'wagmi'
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from 'react'

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
  const peopleEns: { [address: string]: { avatar: any; name: any } } = {}
  if (people) {
    people.map((person: any) => {
      const paddr = person['address']
      peopleEns[paddr] = {
        name: useEnsName({ address: paddr, chainId: Number(1), cacheTime: 60_000 }).data,
        avatar: useEnsAvatar({ addressOrName: paddr, chainId: Number(1), cacheTime: 60_000 }).data
      }
    })
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
                <ListItem key={person['address']}>
                  <Card sx={{ minWidth: 400 }} raised={true}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {peopleEns[person['address']].name}
                      </Typography>
                      <div>{peopleEns[person['address']].avatar}</div>
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
