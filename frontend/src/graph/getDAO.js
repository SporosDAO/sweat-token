import { useQuery } from 'react-query'
import { GRAPH_URL } from './url'

export const getDAO = async (chainId, daoAddress) => {
  console.debug('getDAO', chainId, daoAddress)
  try {
    console.debug('getDAO enter')
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
    console.debug('getDAO result', { res })
    const data = await res.json()
    console.debug('getDAO data', { data })
    return data
  } catch (e) {
    console.debug('getDAO error', { e })
    return e
  }
}

export function useGetDAO(chainId, daoAddress) {
  console.debug('useGetDAO calling getDAO')
  return useQuery(['getDAO', chainId, daoAddress], async () => {
    console.debug('useQuery calling getDAO')
    const data = await getDAO(chainId, daoAddress)
    console.debug('useQuery after getDAO returns', { data })
    return data
  })
}
