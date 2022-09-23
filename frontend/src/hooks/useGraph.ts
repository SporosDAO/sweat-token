import { useState, useEffect } from 'react'
import { request } from 'graphql-request'
import { GRAPH_URL } from '../graph'

// @todo - fix types
const useGraph = (chainId: any, query: any, variables: any) => {
  const [data, setData] = useState()
  const isLoading = data ? false : true

  useEffect(() => {
    if (!chainId || !query || !variables) return

    const fetch = async () => {
      const data = await request(GRAPH_URL[chainId] as any, query, variables)
      setData(data)
    }

    fetch()
  }, [chainId, query, variables])

  return { data, isLoading }
}

export default useGraph
