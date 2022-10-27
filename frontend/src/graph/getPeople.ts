import { useQuery } from 'react-query'
import { GRAPH_URL } from './url'

export const getPeople = async (chainId: number, daoAddress: string | undefined) => {
  if (!daoAddress) return null
  try {
    const res = await fetch(GRAPH_URL[chainId], {
      method: 'POST',
      body: JSON.stringify({
        query: `query {
            daos(where: {
              id: "${daoAddress?.toLowerCase()}"
            }) {
                id
                members {
                    address
                    shares
                  }
                token {
                  totalSupply
                }
            }
          }`
      })
    })
    const data = await res.json()
    return data
  } catch (e) {
    return e
  }
}

export function useGetPeople(chainId: number, daoAddress: string | undefined) {
  return useQuery(['getPeople', chainId, daoAddress], async () => {
    const data = await getPeople(chainId, daoAddress)
    return data
  })
}
