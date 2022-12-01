import { useNetwork, useAccount } from '../../../context/Web3Context'
import { USER_DAOS } from '../../../graph'
import { useQuery } from 'react-query'
import { request } from 'graphql-request'
import { GRAPH_URL } from '../../../graph'
import { CircularProgress } from '@mui/material'
import DaoCard from './DaoCard'

export function useGetUserDAOs(chainId, userAddress) {
  return useQuery([chainId, userAddress, USER_DAOS], async () => {
    if (!chainId || !userAddress) return {}
    const data = await request(GRAPH_URL[chainId], USER_DAOS, { address: userAddress })
    return data
  })
}

export default function MyDAOs() {
  const { chain } = useNetwork()
<<<<<<< HEAD
  const { address, isConnecting, isDisconnected } = useAccount()
=======
  const { address, isConnecting, isConnected, isDisconnected } = useAccount()
>>>>>>> dbe81aefa88bd00a37bb7c9747521a4dc84a626f
  const { data, isLoading, isSuccess } = useGetUserDAOs(chain?.id, address)

  const daos = isSuccess ? data?.['members'] : []

<<<<<<< HEAD
  console.debug({
    daos
  })

  return (
    <>
      {isLoading ? (
=======
  return (
    <>
      {!chain || isDisconnected ? (
        <div>Please connect your web3 wallet.</div>
      ) : isLoading ? (
>>>>>>> dbe81aefa88bd00a37bb7c9747521a4dc84a626f
        <div>
          <span>Loading list of DAOs</span>
          <CircularProgress />
        </div>
      ) : isConnecting ? (
        <div>
          <span>Connecting to your web3 wallet...</span>
          <CircularProgress />
        </div>
<<<<<<< HEAD
      ) : isDisconnected ? (
        <div>Please connect your web3 wallet.</div>
      ) : daos && daos.length > 0 ? (
=======
      ) : isConnected && daos && daos.length > 0 ? (
>>>>>>> dbe81aefa88bd00a37bb7c9747521a4dc84a626f
        daos.map((dao) => <DaoCard key={dao.dao.id} dao={dao.dao} chain={chain} />)
      ) : (
        <div>You are not participating in any for-profit (Sporos-style) DAOs on chain: {chain.name}.</div>
      )}
    </>
  )
}
