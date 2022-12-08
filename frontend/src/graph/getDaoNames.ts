import { useQuery } from 'react-query'
import { GRAPH_URL } from './url'

export async function getDaoNames(chainId: number) {
  try {
    const res = await fetch(GRAPH_URL[chainId], {
      method: 'POST',
      body: JSON.stringify({
        query: `query {
            daos(first: 1000) {
              token {
                name
              }
            }
          }`
      })
    })
    const data = await res.json()
    const names = data?.data?.daos?.map((dao: any) => dao.token?.name)
    // console.debug({ data, names })
    return names
  } catch (e) {
    return e
  }
}

export function useGetDaoNames(chainId: number) {
  return useQuery(['getDaoNames', chainId], async () => {
    const names = await getDaoNames(chainId)
    return names
  })
}
