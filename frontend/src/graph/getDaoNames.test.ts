import { getDaoNames, useGetDaoNames } from './getDaoNames'
import { renderHook, waitFor } from '../../test'
import { useState } from 'react'
import * as reactQuery from 'react-query'

describe('useGetDaoNames hook', () => {
  it('getDaoNames fetches remote data', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(
      Promise.resolve({
        json: () => ({
          data: {
            daos: [{ token: { name: 'TestDAO1' } }, { token: { name: 'TestDAO2' } }]
          }
        })
      } as any)
    )
    const res = await getDaoNames(5)
    expect(res).toMatchObject(['TestDAO1', 'TestDAO2'])
  })

  it('useGetDaoNames hook fetches remote data', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      Promise.resolve({
        json: () => ({
          data: {
            daos: [{ token: { name: 'TestDAO1' } }, { token: { name: 'TestDAO2' } }]
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
    const { result } = await renderHook(() => useGetDaoNames(5))
    await waitFor(async () => {
      const { data, isSuccess } = result.current
      await expect(isSuccess).toBeTruthy()
      await expect(data).toMatchObject(['TestDAO1', 'TestDAO2'])
    })
  })
})
