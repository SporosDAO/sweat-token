import { act, screen, render, waitFor, fireEvent, userEvent } from '../../../test'
import * as daos from '../../graph/getDAO'
import * as wagmi from 'wagmi'

describe('Project Proposal Page', () => {
  beforeEach(() => {
    const useGetDAO = jest.spyOn(daos, 'useGetDAO')
    useGetDAO.mockImplementation(
      (chainId, daoAddress) =>
        ({
          data: {
            id: daoAddress,
            chainId,
            token: {
              name: 'Some DAO',
              symbol: 'DAO'
            }
          },
          isSuccess: true
        } as any)
    )

    jest.spyOn(wagmi, `usePrepareContractWrite`).mockReturnValue({
      config: jest.fn(),
      isError: false,
      error: undefined
    } as any)

    jest.spyOn(wagmi, `useContractWrite`).mockReturnValue({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: undefined,
      isIdle: false,
      write: jest.fn()
    } as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('render project proposal form', async () => {
    await act(async () => {
      await render({
        route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/projects/propose'
      })
    })

    await waitFor(() => {
      expect(screen.getByText('Propose a new project for DAO')).toBeVisible()
      expect(screen.findAllByText('Manager')).toBeTruthy()
      expect(screen.findAllByText('Budget')).toBeTruthy()
      expect(screen.findAllByText('Deadline')).toBeTruthy()
      expect(screen.findAllByText('Goal')).toBeTruthy()
      expect(screen.getByText('Goal Tracking Link')).toBeVisible()
      expect(screen.getByTestId('submit-button')).toBeEnabled()
    })
  })

  it('require project manager to be a DAO member', async () => {
    jest.spyOn(wagmi, `useContractRead`).mockImplementation(({ functionName }: any) => {
      if (functionName === 'extensions') {
        return {
          isError: false,
          isLoading: false,
          isSuccess: true,
          // PM extension already enabled in Kali DAO contract instance
          data: true,
          refetch: jest.fn()
        } as any
      } else if (functionName === 'balanceOf') {
        return {
          isError: false,
          isSuccess: true,
          isLoading: false,
          // proposed project manager is not a DAO member. Has no DAO tokens.
          data: 0,
          refetch: jest.fn()
        } as any
      }
    })

    await act(() => {
      render({
        route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/projects/propose'
      })
    })

    await act(() => {
      waitFor(() => {
        userEvent.click(screen.getByTestId('submit-button'))
      })
    })

    await waitFor(async () => {
      await expect(screen.getByText('Manager must be an existing token holder.')).toBeVisible()
    })

    // await screen.debug(undefined, 1000000)
  })

  it('allow project manager who is a DAO member', async () => {
    jest.spyOn(wagmi, `useContractRead`).mockImplementation(({ functionName }: any) => {
      if (functionName === 'extensions') {
        return {
          isError: false,
          isLoading: false,
          // PM extension already enabled in Kali DAO contract instance
          data: true,
          refetch: jest.fn()
        } as any
      } else if (functionName === 'balanceOf') {
        return {
          isError: false,
          isSuccess: true,
          isLoading: false,
          // proposed project manager is a DAO member. Has 10 DAO tokens.
          data: 10,
          refetch: jest.fn()
        } as any
      }
    })

    await act(() => {
      render({
        route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/projects/propose'
      })
    })

    await act(() => {
      waitFor(() => {
        userEvent.click(screen.getByTestId('submit-button'))
      })
    })

    await waitFor(async () => {
      await expect(screen.queryByText('Manager must be an existing token holder.')).toBeNull()
    })
  })

  it('Enable project management extension if not already enabled', async () => {
    jest.spyOn(wagmi, `useContractRead`).mockImplementation(({ functionName }: any) => {
      if (functionName === 'extensions') {
        return {
          isError: false,
          isLoading: false,
          // PM extension already enabled in Kali DAO contract instance
          data: true,
          refetch: jest.fn()
        } as any
      } else if (functionName === 'balanceOf') {
        return {
          isError: false,
          isSuccess: true,
          isLoading: false,
          // proposed project manager is a DAO member. Has 10 DAO tokens.
          data: 10,
          refetch: jest.fn()
        } as any
      }
    })
    await act(() => {
      render({
        route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/projects/propose'
      })
    })

    await act(() => {
      waitFor(async () => {
        // populate form with a valid proposal
        const manager = await screen.getByTestId('manager').querySelector('input')
        await expect(manager).toBeInTheDocument()
        await fireEvent.change(manager as Element, { target: { value: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439' } })
        await expect(manager?.value).toBe('0xf952a72F39c5Fa22a443200AbE7835128bCb7439')
        const budget = await screen.getByTestId('budget').querySelector('input')
        await expect(budget).toBeInTheDocument()
        await fireEvent.change(budget as Element, { target: { value: '100' } })
        await expect(budget?.value).toBe('100')
        const defaultDeadline = new Date() // Now
        defaultDeadline.setDate(defaultDeadline.getDate() + 30) // Set now + 30 days as the new date
        const deadlineInputVaue = defaultDeadline.toISOString().split('T')[0]
        const deadlineInput = await screen.getByTestId('deadline').querySelector('input')
        await expect(deadlineInput).toBeInTheDocument()
        await fireEvent.change(deadlineInput as Element, { target: { value: deadlineInputVaue } })
        await expect(deadlineInput?.value).toBe(deadlineInputVaue)
        const goalTitle = await screen.getByTestId('goalTitle').querySelector('input')
        await expect(goalTitle).toBeInTheDocument()
        await fireEvent.change(goalTitle as Element, {
          target: { value: '100% test coverage' }
        })
        await expect(goalTitle?.value).toBe('100% test coverage')
        const goalLink = await screen.getByTestId('goalLink').querySelector('input')
        await expect(goalLink).toBeInTheDocument()
        await fireEvent.change(goalLink as Element, {
          target: { value: 'https://github.com/SporosDAO/sweat-token/issues/80' }
        })
        await expect(goalLink?.value).toBe('https://github.com/SporosDAO/sweat-token/issues/80')
      })
    })

    await act(() => {
      waitFor(() => {
        // submit proposal
        userEvent.click(screen.getByTestId('submit-button'))
      })
    })

    await waitFor(async () => {
      await expect(screen.queryByText('Manager must be an existing token holder.')).toBeNull()
    })

    // await screen.debug(undefined, 1000000)

    // check if smart contract input is correct
    await waitFor(() => {
      const web3Submit = screen.getByTestId('web3submit-alert-dialog-title')
      expect(web3Submit).toBeVisible()
    })

    await waitFor(() => expect(screen.getByText(/transaction successfully submitted/i)).toBeInTheDocument())

    await expect(wagmi.usePrepareContractWrite).toHaveBeenCalledWith(
      expect.objectContaining({
        addressOrName: '0xe237747055b12f4da323bc559ac8d5eb66aac2f7', // DAO address
        args: [
          9,
          expect.anything(),
          ['0x9f0ad778385a2c688533958c6ada56f201ffc246'], // PM contract address
          [1], // TOGGLE_EXTENSION_AVAILABILITY == 1
          [expect.anything()]
        ],
        chainId: expect.any(Number),
        contractInterface: expect.anything()
      })
    )
  })

  it('cancel submit on contract read refetch exception', async () => {
    const refetchError = new Error('Refetch error')
    const refetchBalance = jest.fn().mockImplementation(() => {
      throw refetchError
    })
    jest.spyOn(console, 'error')
    jest.spyOn(wagmi, `useContractRead`).mockImplementation(({ functionName }: any) => {
      if (functionName === 'extensions') {
        return {
          isError: false,
          isLoading: false,
          // PM extension already enabled in Kali DAO contract instance
          data: true,
          refetch: jest.fn()
        } as any
      } else if (functionName === 'balanceOf') {
        return {
          isError: false,
          isSuccess: true,
          isLoading: false,
          // proposed project manager is a DAO member. Has 10 DAO tokens.
          data: 10,
          refetch: refetchBalance
        } as any
      }
    })

    await act(() => {
      render({
        route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/projects/propose'
      })
    })

    await act(() => {
      waitFor(async () => {
        // populate form with a valid proposal
        const manager = await screen.getByTestId('manager').querySelector('input')
        await expect(manager).toBeInTheDocument()
        await fireEvent.change(manager as Element, { target: { value: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439' } })
        await expect(manager?.value).toBe('0xf952a72F39c5Fa22a443200AbE7835128bCb7439')
        const budget = await screen.getByTestId('budget').querySelector('input')
        await expect(budget).toBeInTheDocument()
        await fireEvent.change(budget as Element, { target: { value: '100' } })
        await expect(budget?.value).toBe('100')
        const defaultDeadline = new Date() // Now
        defaultDeadline.setDate(defaultDeadline.getDate() + 30) // Set now + 30 days as the new date
        const deadlineInputVaue = defaultDeadline.toISOString().split('T')[0]
        const deadlineInput = await screen.getByTestId('deadline').querySelector('input')
        await expect(deadlineInput).toBeInTheDocument()
        await fireEvent.change(deadlineInput as Element, { target: { value: deadlineInputVaue } })
        await expect(deadlineInput?.value).toBe(deadlineInputVaue)
        const goalTitle = await screen.getByTestId('goalTitle').querySelector('input')
        await expect(goalTitle).toBeInTheDocument()
        await fireEvent.change(goalTitle as Element, {
          target: { value: '100% test coverage' }
        })
        await expect(goalTitle?.value).toBe('100% test coverage')
        const goalLink = await screen.getByTestId('goalLink').querySelector('input')
        await expect(goalLink).toBeInTheDocument()
        await fireEvent.change(goalLink as Element, {
          target: { value: 'https://github.com/SporosDAO/sweat-token/issues/80' }
        })
        await expect(goalLink?.value).toBe('https://github.com/SporosDAO/sweat-token/issues/80')
      })
    })

    await act(() => {
      waitFor(() => {
        userEvent.click(screen.getByTestId('submit-button'))
      })
    })

    // screen.debug(undefined, 100000)

    await waitFor(async () => {
      await expect(screen.queryByText('Manager must be an existing token holder.')).toBeNull()
      await expect(refetchBalance).toHaveBeenCalledTimes(1)
      await expect(console.error).toHaveBeenCalledWith(expect.objectContaining(refetchError))
    })
  })
})
