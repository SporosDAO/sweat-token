import { useNetwork, useAccount } from '../context/Web3Context'
import { useGraph } from './hooks/useGraph'
import { USER_DAOS } from '../graph'
import { List, ListItem, Button, Card, CardContent, CardActionArea, Typography } from '@mui/material'
import { useQuery } from 'react-query'
import { request } from 'graphql-request'
import { GRAPH_URL } from '../graph'

export function useGetUserDAOs(chainId, userAddress) {
  return useQuery([chainId, userAddress, USER_DAOS], async () => {
    if (!chainId) return {}
    const data = await request(GRAPH_URL[chainId], USER_DAOS, { address: userAddress })
    return data
  })
}

export default function MyDAOs() {
  const { chain } = useNetwork()
  const { address, isConnecting, isDisconnected } = useAccount()
  console.log({ address, isConnecting, isDisconnected })

  const { data, error, isLoading, isSuccess } = useGetUserDAOs(chain?.id, address)

  const daos = data?.['members']

  console.log({ chain })
  console.log({ daos })

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : isConnecting ? (
        <div>Connecting to your web3 wallet...</div>
      ) : isDisconnected ? (
        <div>Please connect your web3 wallet.</div>
      ) : daos && daos.length > 0 ? (
        <List>
          {daos.map((dao) => (
            <ListItem key={dao['dao']['id']}>
              <Card sx={{ minWidth: 275 }} raised={true}>
                <CardActionArea href={`dao/chain/${chain.id}/address/${dao['dao']['id']}/people`}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {dao['dao']['token']['name']}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      symbol: {dao['dao']['token']['symbol']}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      chain: {chain.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      address: {dao['dao']['address']}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </ListItem>
          ))}
        </List>
      ) : (
        <div>You are not participating in any for-profit (Sporos-style) DAOs on chain: {chain.name}.</div>
      )}
    </>
  )
}
