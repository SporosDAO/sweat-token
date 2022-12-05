import { useGetProposals, getProposals, getProposal, useGetProposal, findProcessableProposals } from './getProposals'
import { renderHook, waitFor } from '../../test'
import { useState } from 'react'
import * as reactQuery from 'react-query'

describe('getProposal(s) hooks', () => {
  afterAll(() => {
    jest.useRealTimers()
  })

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

  it('useGetProposals hook fetches remote data', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
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
    jest.spyOn(reactQuery, 'useQuery').mockImplementation((args, fn) => {
      const [res, setRes] = useState(undefined)
      const promise: Promise<unknown> = Promise.resolve(fn(undefined as any))
      promise.then((data) => setRes(data as any))
      return { data: res, isSuccess: true } as any
    })
    const { result } = await renderHook(() => useGetProposals({ chainId: 5, daoAddress: '567' }))
    await waitFor(async () => {
      const { data, isSuccess } = result.current
      await expect(isSuccess).toBeTruthy()
      await expect(data).toMatchObject([{ id: 567 }])
    })
  })

  it('getProposal fetches remote data', async () => {
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
    const res = await getProposal({ chainId: 5, daoAddress: '567', proposalSerial: 10 })
    expect(res).toMatchObject({ id: 567 })
  })

  it('getProposal returns immediately when daoId is unknown', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(
      Promise.resolve({
        json: () => null
      } as any)
    )
    const res = await getProposal({ chainId: 5, daoAddress: undefined, proposalSerial: 10 })
    expect(res).toBeNull()
  })

  it('getProposal returns null when no data fetched', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(
      Promise.resolve({
        json: () => null
      } as any)
    )
    const res = await getProposal({ chainId: 5, daoAddress: '567', proposalSerial: 10 })
    expect(res).toBeNull()
  })

  it('useGetProposal hook fetches remote data', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
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
    jest.spyOn(reactQuery, 'useQuery').mockImplementation((args, fn) => {
      const [res, setRes] = useState(undefined)
      const promise: Promise<unknown> = Promise.resolve(fn(undefined as any))
      promise.then((data) => setRes(data as any))
      return { data: res, isSuccess: true } as any
    })
    const { result } = await renderHook(() => useGetProposal({ chainId: 5, daoAddress: '567', proposalSerial: 10 }))
    await waitFor(async () => {
      const { data, isSuccess } = result.current
      await expect(isSuccess).toBeTruthy()
      await expect(data).toMatchObject({ id: 567 })
    })
  })

  it('findProcessableProposals filters out unsponsored proposals', async () => {
    const res = findProcessableProposals([{}])
    expect(res).toMatchObject([])
  })

  it('findProcessableProposals filters out proposals until their voting time window closes', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2020, 3, 1))
    const now = new Date()
    const startAsDate = new Date()
    startAsDate.setDate(now.getDate() + 1) // set start time one day from now
    const dateInSecs = Math.floor(startAsDate.getTime() / 1000)
    const votingStarts = dateInSecs
    const votingPeriod = 300 // 5 minute voting period
    const res = findProcessableProposals([{ votingStarts, dao: { votingPeriod }, sponsored: true }])
    expect(res).toMatchObject([])
  })

  it('findProcessableProposals filters out proposals that have been processed', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2020, 3, 1))
    const now = new Date()
    const startAsDate = new Date()
    startAsDate.setDate(now.getDate() - 10) // set start time ten days ago
    const dateInSecs = Math.floor(startAsDate.getTime() / 1000)
    const votingStarts = dateInSecs
    const votingPeriod = 300 // 5 minute voting period
    let res = findProcessableProposals([{ votingStarts, dao: { votingPeriod }, sponsored: true, status: true }])
    expect(res).toMatchObject([])
    res = findProcessableProposals([{ votingStarts, dao: { votingPeriod }, sponsored: true, status: false }])
    expect(res).toMatchObject([])
    res = findProcessableProposals([
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: true },
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: false }
    ])
    expect(res).toMatchObject([])
  })

  it('findProcessableProposals allows ESCAPE proposals that have not been processed.', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2020, 3, 1))
    const now = new Date()
    const startAsDate = new Date()
    startAsDate.setDate(now.getDate() - 10) // set start time ten days ago
    const dateInSecs = Math.floor(startAsDate.getTime() / 1000)
    const votingStarts = dateInSecs
    const votingPeriod = 300 // 5 minute voting period
    const res = findProcessableProposals([
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: null, proposalType: 'ESCAPE' }, // filter through
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: false, proposalType: 'ESCAPE' }, // filter out
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: false }, // filter out
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: undefined } // filter out
    ])
    expect(res).toMatchObject([
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: null, proposalType: 'ESCAPE' }
    ])
  })

  it('findProcessableProposals allows non-ESCAPE proposals that follow processed proposals', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2020, 3, 1))
    const now = new Date()
    const startAsDate = new Date()
    startAsDate.setDate(now.getDate() - 10) // set start time ten days ago
    const dateInSecs = Math.floor(startAsDate.getTime() / 1000)
    const votingStarts = dateInSecs
    const votingPeriod = 300 // 5 minute voting period
    const res = findProcessableProposals([
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: null },
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: false }
    ])
    expect(res).toMatchObject([{ votingStarts, dao: { votingPeriod }, sponsored: true, status: null }])
  })

  it('findProcessableProposals filters out non-ESCAPE proposals that are not followed by processed proposals', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2020, 3, 1))
    const now = new Date()
    const startAsDate = new Date()
    startAsDate.setDate(now.getDate() - 10) // set start time ten days ago
    const dateInSecs = Math.floor(startAsDate.getTime() / 1000)
    const votingStarts = dateInSecs
    const votingPeriod = 300 // 5 minute voting period
    const res = findProcessableProposals([
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: null },
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: undefined }
    ])
    expect(res).toMatchObject([])
  })

  it('findProcessableProposals filters out ESCAPEd proposals', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2020, 3, 1))
    const now = new Date()
    const startAsDate = new Date()
    startAsDate.setDate(now.getDate() - 10) // set start time ten days ago
    const dateInSecs = Math.floor(startAsDate.getTime() / 1000)
    const votingStarts = dateInSecs
    const votingPeriod = 300 // 5 minute voting period
    const res = findProcessableProposals([
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: null, escaped: true },
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: true }
    ])
    expect(res).toMatchObject([])
  })

  it('findProcessableProposals filters out CANCELLed proposals', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2020, 3, 1))
    const now = new Date()
    const startAsDate = new Date()
    startAsDate.setDate(now.getDate() - 10) // set start time ten days ago
    const dateInSecs = Math.floor(startAsDate.getTime() / 1000)
    const votingStarts = dateInSecs
    const votingPeriod = 300 // 5 minute voting period
    const res = findProcessableProposals([
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: null, cancelled: true },
      { votingStarts, dao: { votingPeriod }, sponsored: true, status: true }
    ])
    expect(res).toMatchObject([])
  })
})
