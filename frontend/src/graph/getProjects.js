import { GRAPH_URL } from './url'

export const getProjects = async (chainId, daoAddress) => {
  console.log('getProjects', chainId, daoAddress)
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
    return data
  } catch (e) {
    return e
  }
}

export function useGetProjects(chainId, daoAddress) {
  return useQuery(['getPeople', chainId, daoAddress], async () => {
    const data = await getProjects(chainId, daoAddress)
    return data
  })
}
