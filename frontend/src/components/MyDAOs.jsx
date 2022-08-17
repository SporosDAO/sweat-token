import { useNetwork, useAccount } from '../context/Web3Context'
import { USER_DAOS } from '../graph'
import { List, ListItem, Card, CardActions, Button, CardContent, CardActionArea, Typography } from '@mui/material'
import { Launch, ReadMore } from '@mui/icons-material'
import { useQuery } from 'react-query'
import { request } from 'graphql-request'
import { GRAPH_URL } from '../graph'
import { useNavigate } from 'react-router-dom'

export function useGetUserDAOs(chainId, userAddress) {
  return useQuery([chainId, userAddress, USER_DAOS], async () => {
    if (!chainId || !userAddress) return {}
    const data = await request(GRAPH_URL[chainId], USER_DAOS, { address: userAddress })
    return data
  })
}

export default function MyDAOs() {
  const navigate = useNavigate()
  const { chain } = useNetwork()
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data, isLoading, isSuccess } = useGetUserDAOs(chain?.id, address)

  const daos = isSuccess ? data?.['members'] : []

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
            <ListItem key={dao.dao.id} data-cy={dao.dao.id}>
              <Card sx={{ width: '100%' }} raised={true}>
                <CardActionArea
                  onClick={() => {
                    navigate(`dao/chain/${chain.id}/address/${dao['dao']['id']}/projects`)
                  }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {dao['dao']['token']['name']}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                      Symbol: {dao['dao']['token']['symbol']}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                      Chain: {chain.name}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                      Address: {dao['dao']['address']}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button
                    variant="text"
                    endIcon={<ReadMore />}
                    fontSize="inherit"
                    onClick={() => {
                      navigate(`dao/chain/${chain.id}/address/${dao['dao']['id']}/projects`)
                    }}
                  >
                    Open
                  </Button>
                  <Button
                    variant="text"
                    endIcon={<Launch />}
                    fontSize="inherit"
                    href={`https://app.kali.gg/daos/${chain.id}/${dao['dao']['address']}`}
                    rel="noopener"
                    target="_blank"
                  >
                    Kali
                  </Button>
                </CardActions>
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
