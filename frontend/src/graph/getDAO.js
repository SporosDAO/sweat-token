import { useQuery } from 'react-query'
import { GRAPH_URL } from './url'

export const getDAO = async (chainId, daoAddress) => {
  console.log('getDAO', chainId, daoAddress)
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
          }`
      })
    })
    console.log('result', res)
    const data = await res.json()
    return data
  } catch (e) {
    return e
  }
}

export function useGetDAO(chainId, daoAddress) {
  return useQuery(['getDAO', chainId, daoAddress], async () => {
    const data = await getDAO(chainId, daoAddress)
    return data
  })
}