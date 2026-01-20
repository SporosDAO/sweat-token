import { useQuery } from 'react-query'
import { GRAPH_URL } from './url'

export async function getDAO(chainId: number, daoAddress: string | undefined) {
  if (!daoAddress) return null
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
    console.error('getDAO error', { e })
    return e
  }
}

export function useGetDAO(chainId: number, daoAddress: string | undefined) {
  return useQuery(['getDAO', chainId, daoAddress], async () => {
    const data = await getDAO(chainId, daoAddress)
    // simplify structure and enrich subgraph result
    // end result looks like this
    // {
    //     "id": "0xe237747055b12f4da323bc559ac8d5eb66aac2f7",
    //     "chainId": "5"
    //     "token": {
    //         "name": "PMTest",
    //         "symbol": "PMT"
    //     },
    // }
    const myDao = { ...data?.data?.dao, chainId }
    return myDao
  })
}
