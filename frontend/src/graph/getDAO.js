import { useQuery } from 'react-query'
import { GRAPH_URL } from './url'

export const getDAO = async (chainId, daoAddress) => {
  try {
    const res = await fetch(GRAPH_URL[chainId], {
      method: 'POST',
      body: JSON.stringify({
        query: `query {
          dao(id: "${daoAddress.toLowerCase()}") {
            id
            token {
              name
              symbol
            }
          }
        }`
      })
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.debug('getDAO error', { e })
    return e
  }
}

export function useGetDAO(chainId, daoAddress) {
  return useQuery(['getDAO', chainId, daoAddress], async () => {
    const data = await getDAO(chainId, daoAddress)
    return data
  })
}
