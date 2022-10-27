import MyDAOs from './MyDAOs'

import { act, render, screen, waitFor } from '../../test'
import * as graphqlRequest from 'graphql-request'
import * as wagmi from 'wagmi'
import * as reactRouter from 'react-router-dom'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom')
  return {
    ...originalModule,
    useNavigate: () => mockNavigate
  }
})

describe('MyDAOs component', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('shows empty list when user is not part of any Kali DAOs', async () => {
    jest.spyOn(graphqlRequest, 'request').mockImplementation(async () => undefined)
    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
      isConnecting: false,
      isDisconnected: false
    } as any)
    await act(() => {
      render({
        ui: <MyDAOs />
      })
    })
    await waitFor(() => {
      expect(screen.getByText(/Please connect your web3 wallet/i)).toBeVisible()
    })
  })

  it('shows loading progress while fetching dao list', async () => {
    jest.spyOn(graphqlRequest, 'request').mockImplementation(
      async () =>
        new Promise(() => {
          // do not resolve to simulate long network fetch
          return
        })
    )
    jest.spyOn(wagmi, 'useNetwork').mockReturnValue({ chain: { id: 5, name: 'goerli' } } as any)
    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
      isConnecting: false,
      isDisconnected: false
    } as any)
    await act(() => {
      render({
        ui: <MyDAOs />
      })
    })
    await waitFor(() => {
      expect(screen.getByText(/Loading.../i)).toBeVisible()
      expect(screen.queryByText(/Please connect your web3 wallet/i)).toBeNull()
    })
  })

  it('shows connecting progress while waiting on wallet response', async () => {
    jest.spyOn(graphqlRequest, 'request').mockImplementation(async () => undefined)
    jest.spyOn(wagmi, 'useNetwork').mockReturnValue({ chain: { id: 5, name: 'goerli' } } as any)
    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
      isConnecting: true,
      isDisconnected: false
    } as any)
    await act(() => {
      render({
        ui: <MyDAOs />
      })
    })
    await waitFor(() => {
      expect(screen.getByText(/Connecting to your web3 wallet.../i)).toBeVisible()
      expect(screen.queryByText(/Loading.../i)).toBeNull()
      expect(screen.queryByText(/Please connect your web3 wallet/i)).toBeNull()
    })
  })

  it('shows list of DAOs that the user is part of (i.e. user owns a DAO native token)', async () => {
    jest.spyOn(graphqlRequest, 'request').mockImplementation(async () => ({
      members: [
        {
          dao: {
            id: 1,
            address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7001',
            token: {
              name: 'DaoA',
              symbol: 'DA'
            }
          }
        },
        {
          dao: {
            id: 2,
            address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7002',
            token: {
              name: 'DaoB',
              symbol: 'DB'
            }
          }
        }
      ]
    }))
    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
      isConnecting: false,
      isDisconnected: false,
      connector: undefined,
      isConnected: true,
      isReconnecting: false,
      status: 'connecting'
    } as any)
    jest.spyOn(wagmi, 'useNetwork').mockReturnValue({ chain: { id: 5, name: 'goerli' } } as any)
    let user: UserEvent
    await act(() => {
      user = render({
        ui: <MyDAOs />
      }).user
    })
    await waitFor(() => {
      expect(screen.getByText(/DaoA/i)).toBeVisible()
      expect(screen.getByText(/0xf952a72F39c5Fa22a443200AbE7835128bCb7001/i)).toBeVisible()
      expect(screen.getByText(/DaoB/i)).toBeVisible()
      expect(screen.getByText(/0xf952a72F39c5Fa22a443200AbE7835128bCb7002/i)).toBeVisible()
    })
  })

  it('shows DAO Kali links)', async () => {
    jest.spyOn(graphqlRequest, 'request').mockImplementation(async () => ({
      members: [
        {
          dao: {
            id: 1,
            address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7001',
            token: {
              name: 'DaoA',
              symbol: 'DA'
            }
          }
        },
        {
          dao: {
            id: 2,
            address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7002',
            token: {
              name: 'DaoB',
              symbol: 'DB'
            }
          }
        }
      ]
    }))
    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
      isConnecting: false,
      isDisconnected: false,
      connector: undefined,
      isConnected: true,
      isReconnecting: false,
      status: 'connecting'
    } as any)
    jest.spyOn(wagmi, 'useNetwork').mockReturnValue({ chain: { id: 5, name: 'goerli' } } as any)
    let user: UserEvent
    await act(() => {
      user = render({
        ui: <MyDAOs />
      }).user
    })
    await act(async () => {
      await expect(screen.getByTestId('kali-link-1')).toHaveAttribute(
        'href',
        'https://app.kali.gg/daos/5/0xf952a72F39c5Fa22a443200AbE7835128bCb7001'
      )
      await expect(screen.getByTestId('kali-link-2')).toHaveAttribute(
        'href',
        'https://app.kali.gg/daos/5/0xf952a72F39c5Fa22a443200AbE7835128bCb7002'
      )
    })
  })

  it('shows DAO projects links and navigates on click)', async () => {
    jest.spyOn(graphqlRequest, 'request').mockImplementation(async () => ({
      members: [
        {
          dao: {
            id: 1,
            address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7001',
            token: {
              name: 'DaoA',
              symbol: 'DA'
            }
          }
        },
        {
          dao: {
            id: 2,
            address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7002',
            token: {
              name: 'DaoB',
              symbol: 'DB'
            }
          }
        }
      ]
    }))
    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
      isConnecting: false,
      isDisconnected: false,
      connector: undefined,
      isConnected: true,
      isReconnecting: false,
      status: 'connecting'
    } as any)
    jest.spyOn(wagmi, 'useNetwork').mockReturnValue({ chain: { id: 5, name: 'goerli' } } as any)
    let user: UserEvent
    await act(() => {
      user = render({
        ui: <MyDAOs />
      }).user
    })
    await act(async () => {
      await screen.getAllByTestId('projects-link-1').forEach((link) => {
        user.click(link)
      })
    })
    await waitFor(() => {
      // expect 2 clicks because DAO card itself and Open button link to DAO projects
      expect(mockNavigate).toHaveBeenCalledTimes(2)
      expect(mockNavigate).toHaveBeenCalledWith(
        'dao/chain/5/address/0xf952a72F39c5Fa22a443200AbE7835128bCb7001/projects/'
      )
    })
  })

  it('shows user they are not part of any DAOs on current chain when chain query returns empty)', async () => {
    jest.spyOn(graphqlRequest, 'request').mockImplementation(async () => ({
      members: []
    }))
    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
      isConnecting: false,
      isDisconnected: false,
      connector: undefined,
      isConnected: true,
      isReconnecting: false,
      status: 'connecting'
    } as any)
    jest.spyOn(wagmi, 'useNetwork').mockReturnValue({ chain: { id: 5, name: 'goerli' } } as any)
    await act(() => {
      render({
        ui: <MyDAOs />
      })
    })
    await waitFor(() => {
      expect(screen.getByText(/You are not participating/i)).toBeVisible()
      expect(screen.queryByText(/DaoA/i)).toBeNull()
      expect(screen.queryByText(/0xf952a72F39c5Fa22a443200AbE7835128bCb7001/i)).toBeNull()
    })
  })
})
