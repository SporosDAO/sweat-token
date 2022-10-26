import { getDAO, useGetDAO } from './getDAO'
import { renderHook, waitFor } from '../../test'
import { useState } from 'react'
import * as reactQuery from 'react-query'

describe('useGetDAO hook', () => {
  it('getDao fetches remote data', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(
      Promise.resolve({
        json: () => ({
          id: 567
        })
      } as any)
    )
    const res = await getDAO(5, '567')
    expect(res).toMatchObject({ id: 567 })
  })

  it('useGetDao hook fetches remote data', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      Promise.resolve({
        json: () => ({
          data: {
            dao: {
              id: 567
            }
          }
        })
      } as any)
    )
    jest.spyOn(reactQuery, 'useQuery').mockImplementation((args, fn) => {
      const [res, setRes] = useState(undefined)
      const promise: Promise<unknown> = Promise.resolve(fn(undefined as any))
      promise.then((data) => setRes(data as any))
      return { data: res, isSuccess: true } as any
    })
    const { result } = await renderHook(() => useGetDAO(5, '567'))
    await waitFor(async () => {
      const { data, isSuccess } = result.current
      await expect(isSuccess).toBeTruthy()
      await expect(data).toMatchObject({ chainId: 5, id: 567 })
    })
  })
})
