import { useQuery } from 'react-query'
import { GRAPH_URL } from './url'

export const getPeople = async (chainId, daoAddress) => {
  console.log('getPeople', chainId, daoAddress)
  try {
    const res = await fetch(GRAPH_URL[chainId], {
      method: 'POST',
      body: JSON.stringify({
        query: `query {
            daos(where: {
              id: "${daoAddress.toLowerCase()}"
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
    console.log('result', res)
    const data = await res.json()
    console.log('data', data)
    return data
  } catch (e) {
    return e
  }
}

export function useGetPeople(chainId, daoAddress) {
  return useQuery(['getPeople', chainId, daoAddress], async () => {
    const data = await getPeople(chainId, daoAddress)
    return data
  })
}
