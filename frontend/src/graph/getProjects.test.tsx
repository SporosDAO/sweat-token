import { waitFor } from '../../test'
import { useGetProjects } from './getProjects'
import * as wagmi from 'wagmi'
import { ethers } from 'ethers'
import { renderHook } from '../../test'

describe('useGetProjects hook', () => {
  beforeEach(() => {
    jest.spyOn(wagmi, `useContractRead`).mockReturnValue({
      data: 101
    } as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('fetches RPC data', async () => {
    jest.spyOn(wagmi, `useContractReads`).mockReturnValue({
      data: [
        {
          id: 321,
          dao: '567',
          goals: '{"title": "test goal 1"}',
          budget: ethers.utils.parseEther('10000'),
          deadline: 20221101,
          manager: '0xe237747055b12f4da323bc559ac8d5eb66aac2f7'
        },
        {
          id: 299,
          dao: '789',
          goals: '{"title": "test goal 2"}',
          budget: ethers.utils.parseEther('20000'),
          deadline: 20221101,
          manager: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439'
        }
      ],
      error: undefined,
      isError: false,
      isLoading: false,
      isSuccess: true
    } as any)
    const { result } = await renderHook(() => useGetProjects(5, '567'))
    await waitFor(async () => {
      const { projects, isSuccess } = result.current
      await expect(isSuccess).toBeTruthy()
      await expect(projects).toMatchObject([
        {
          budget: '10000.0',
          deadline: 20221101,
          goals: {
            title: 'test goal 1'
          },
          manager: '0xe237747055b12f4da323bc559ac8d5eb66aac2f7',
          projectID: 321
        }
      ])
    })
  })

  it('handles gracefully goals in non JSON format', async () => {
    jest.spyOn(wagmi, `useContractReads`).mockReturnValue({
      data: [
        {
          id: 321,
          dao: '567',
          goals: 'random',
          budget: ethers.utils.parseEther('10000'),
          deadline: 20221101,
          manager: '0xe237747055b12f4da323bc559ac8d5eb66aac2f7'
        },
        {
          id: 299,
          dao: '789',
          goals: '{"title": "test goal 2"}',
          budget: ethers.utils.parseEther('20000'),
          deadline: 20221101,
          manager: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439'
        }
      ],
      error: undefined,
      isError: false,
      isLoading: false,
      isSuccess: true
    } as any)
    const { result } = await renderHook(() => useGetProjects(5, '567'))
    await waitFor(async () => {
      const { projects, isSuccess } = result.current
      await expect(isSuccess).toBeTruthy()
      await expect(projects).toMatchObject([
        {
          budget: '10000.0',
          deadline: 20221101,
          goals: [
            {
              goalLink: '',
              goalTitle: 'random'
            }
          ],
          manager: '0xe237747055b12f4da323bc559ac8d5eb66aac2f7',
          projectID: 321
        }
      ])
    })
  })

  it('reports contract read errors', async () => {
    jest.spyOn(console, 'error')
    jest.spyOn(wagmi, `useContractRead`).mockImplementation(({ onError }: any) => {
      onError('useContractReads')
      return { data: 101 } as any
    })
    jest.spyOn(wagmi, `useContractReads`).mockImplementation(({ onError }: any) => {
      onError('useContractReads')
      return {
        data: [],
        error: undefined,
        isError: false,
        isLoading: false,
        isSuccess: false
      } as any
    })
    const { result } = await renderHook(() => useGetProjects(5, '567'))
    await waitFor(async () => {
      const { isSuccess } = result.current
      await expect(isSuccess).toBeFalsy()
      await expect(console.error).toHaveBeenCalledTimes(2)
    })
  })

  it('handles DAOs without any projects', async () => {
    jest.spyOn(wagmi, `useContractRead`).mockReturnValue({
      data: undefined
    } as any)
    jest.spyOn(wagmi, `useContractReads`).mockReturnValue({
      data: [],
      isSuccess: true
    } as any)
    const { result } = await renderHook(() => useGetProjects(5, '567'))
    await waitFor(async () => {
      const { isSuccess } = result.current
      await expect(isSuccess).toBeTruthy()
    })
  })
})
