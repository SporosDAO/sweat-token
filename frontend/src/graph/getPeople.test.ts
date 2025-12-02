import { getPeople, useGetPeople } from './getPeople'
import { renderHook, waitFor } from '../../test'
import { useState } from 'react'
import * as reactQuery from 'react-query'

describe('useGetPeople hook', () => {
  it('getPeople fetches remote data', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(
      Promise.resolve({
        json: () => ({
          id: 567
        })
      } as any)
    )
    const res = await getPeople(5, '567')
    expect(res).toMatchObject({ id: 567 })
  })

  it('getPeople returns immediately when daoId is unknown', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(
      Promise.resolve({
        json: () => ({
          id: 567
        })
      } as any)
    )
    const res = await getPeople(5, undefined)
    expect(res).toBeNull()
  })

  it('useGetPeople hook fetches remote data', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      Promise.resolve({
        json: () => ({
          id: 567
        })
      } as any)
    )
    jest.spyOn(reactQuery, 'useQuery').mockImplementation((args, fn) => {
      const [res, setRes] = useState(undefined)
      const promise: Promise<unknown> = Promise.resolve(fn(undefined as any))
      promise.then((data) => setRes(data as any))
      return { data: res, isSuccess: true } as any
    })
    const { result } = await renderHook(() => useGetPeople(5, '567'))
    await waitFor(async () => {
      const { data, isSuccess } = result.current
      await expect(isSuccess).toBeTruthy()
      await expect(data).toMatchObject({ id: 567 })
    })
  })
})
