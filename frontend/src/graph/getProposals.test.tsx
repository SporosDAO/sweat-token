import { useGetProposals, getProposals } from './getProposals'
import { renderHook, waitFor } from '../../test'
import { useState } from 'react'
import * as reactQuery from 'react-query'

describe('getProposal(s) hooks', () => {
  it('getProposals fetches remote data', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(
      Promise.resolve({
        json: () => ({
          data: {
            proposals: [
              {
                id: 567
              }
            ]
          }
        })
      } as any)
    )
    const res = await getProposals({ chainId: 5, daoAddress: '567' })
    console.debug(res)
    expect(res[0]).toMatchObject({ id: 567 })
  })

  it('getProposals returns immediately when daoId is unknown', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(
      Promise.resolve({
        json: () => null
      } as any)
    )
    const res = await getProposals({ chainId: 5, daoAddress: undefined })
    expect(res).toBeNull()
  })

  // it('useGetProposals hook fetches remote data', async () => {
  //   jest.spyOn(global, 'fetch').mockResolvedValue(
  //     Promise.resolve({
  //       json: () => ({
  //         id: 567
  //       })
  //     } as any)
  //   )
  //   jest.spyOn(reactQuery, 'useQuery').mockImplementation((args, fn) => {
  //     const [res, setRes] = useState(undefined)
  //     const promise: Promise<unknown> = Promise.resolve(fn(undefined as any))
  //     promise.then((data) => setRes(data as any))
  //     return { data: res, isSuccess: true } as any
  //   })
  //   const { result } = await renderHook(() => useGetProposals({ chainId: 5, daoAddress: '567' }))
  //   await waitFor(async () => {
  //     const { data, isSuccess } = result.current
  //     await expect(isSuccess).toBeTruthy()
  //     await expect(data).toMatchObject({ id: 567 })
  //   })
  // })
})
