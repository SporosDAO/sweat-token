// @todo Keith - fix types
import { request } from 'graphql-request'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Launch, ReadMore } from '@mui/icons-material'
import { List, ListItem, Card, CardActions, Button, CardContent, CardActionArea, Typography } from '@mui/material'

import { GRAPH_URL, USER_DAOS } from '../../../graph'
import { useNetwork, useAccount } from '../../../context/Web3Context'

export const useGetUserDAOs = (chainId: any, userAddress: string) => {
  return useQuery([chainId, userAddress, USER_DAOS], async () => {
    if (!chainId || !userAddress) return {}
    const data = await request(GRAPH_URL[chainId], USER_DAOS, { address: userAddress })
    return data
  })
}

const MyDAOs: React.FC = () => {
  const navigate = useNavigate()
  const { chain }: any = useNetwork()
  const { address, isConnecting, isDisconnected }: any = useAccount()
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
          {daos.map((dao: any) => (
            <ListItem key={dao.dao.id} data-testid={dao.dao.id}>
              <Card sx={{ width: '100%' }} raised={true}>
                <CardActionArea
                  onClick={() => {
                    navigate(`dao/chain/${chain.id}/address/${dao['dao']['id']}/projects/`)
                  }}
                >
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
                    onClick={() => {
                      navigate(`dao/chain/${chain.id}/address/${dao['dao']['id']}/projects/`)
                    }}
                  >
                    Open
                  </Button>
                  <Button
                    variant="text"
                    endIcon={<Launch />}
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

export default MyDAOs
