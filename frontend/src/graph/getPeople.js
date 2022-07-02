import React from 'react'
import { GRAPH_URL } from './url'

export const getPeople = async (chainId, address) => {
  console.log('memberParms', chainId, address)
  try {
    const res = await fetch(GRAPH_URL[chainId], {
      method: 'POST',
      body: JSON.stringify({
        query: `query {
            daos(where: {
              id: "${address.toLowerCase()}"
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
    console.log('res', res)
    const data = await res.json()
    return data
  } catch (e) {
    return e
  }
}
