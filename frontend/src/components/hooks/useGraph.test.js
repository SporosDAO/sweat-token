import { useState, useEffect } from 'react'
import { request } from 'graphql-request'
import { useGraph } from './useGraph'
jest.mock('react')
jest.mock('graphql-request')

describe('React Hooks for TheGraph queries', () => {
  beforeEach(() => {
    request.mockResolvedValue('data123')
    useEffect.mockImplementation((f) => f())
    useState.mockImplementation(() => {
      let data = {
        body: undefined
      }
      return [data, (v) => (data.body = v)]
    })
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  test('fetch query for chainid', async () => {
    const { data, isLoading } = await useGraph(5, 'some/query', { arg1: 'val1' })
    await expect(request).toHaveBeenCalledTimes(1)
    await expect(request).toHaveBeenCalledWith(
      'https://api.thegraph.com/subgraphs/name/nerderlyne/kali-goerli',
      'some/query',
      { arg1: 'val1' }
    )
    await expect(data.body).toBe('data123')
    await expect(isLoading).toBeFalsy()
  })

  test('return empty if args missing', async () => {
    const { data } = await useGraph(undefined, 'some/query', { arg1: 'val1' })
    await expect(request).toHaveBeenCalledTimes(0)
    await expect(data.body).toBe(undefined)
  })
})
