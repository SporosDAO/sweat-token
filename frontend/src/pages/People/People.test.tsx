import { ethers } from 'ethers'
import { screen, render, waitFor, within, userEvent, act } from '../../../test'
import * as getPeople from '../../graph/getPeople'
import * as daos from '../../graph/getDAO'

describe('DAO People Page', () => {
  beforeEach(() => {
    jest.spyOn(daos, 'useGetDAO').mockReturnValue({
      data: {
        dao: {
          id: 567
        }
      },
      isSuccess: true
    } as any)
  })

  it('renders DAO members', async () => {
    jest.spyOn(getPeople, 'useGetPeople').mockImplementation(
      (chainId: number, daoAddress: string | undefined) =>
        ({
          data: {
            data: {
              daos: [
                {
                  id: daoAddress,
                  chainId,
                  token: {
                    name: 'Some DAO',
                    symbol: 'DAO',
                    totalSupply: 400500
                  },
                  members: [
                    {
                      address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
                      shares: ethers.utils.parseEther('25')
                    }
                  ]
                }
              ]
            }
          },
          isSuccess: true
        } as any)
    )
    await render({
      route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/people'
    })
    await waitFor(() => {
      expect(screen.findAllByText('People')).toBeTruthy()
      const memberAddress = screen.getByTestId('member-address')
      expect(memberAddress).toBeVisible()
      expect(within(memberAddress).getByText('0xf952a72F39c5Fa22a443200AbE7835128bCb7439')).toBeVisible()
      const memberShares = screen.getByTestId('member-shares')
      expect(memberShares).toBeVisible()
      expect(within(memberShares).getByText(/Tokens: 25/i)).toBeVisible()
    })
  })

  it('renders progress icon while fetching people data', async () => {
    jest.spyOn(getPeople, 'useGetPeople').mockImplementation(
      (chainId: number, daoAddress: string | undefined) =>
        ({
          data: {
            data: {}
          },
          isSuccess: false,
          isLoading: true
        } as any)
    )
    await render({
      route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/people'
    })
    await waitFor(() => {
      expect(screen.getByTestId('progress-icon')).toBeVisible()
    })
  })

  it('renders retry button on error while fetching data', async () => {
    jest.spyOn(getPeople, 'useGetPeople').mockImplementation(
      (chainId: number, daoAddress: string | undefined) =>
        ({
          data: {},
          isSuccess: false,
          isError: true,
          error: 'Error while fetching remote data',
          isLoading: false
        } as any)
    )
    await render({
      route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/people'
    })
    let retryBtn: Element
    await waitFor(() => {
      retryBtn = screen.getByTestId('retry-btn')
      expect(retryBtn).toBeVisible()
    })
    jest.spyOn(MouseEvent.prototype, 'preventDefault')
    await act(() => {
      userEvent.click(retryBtn)
    })
    await waitFor(() => {
      expect(MouseEvent.prototype.preventDefault).toHaveBeenCalledTimes(1)
    })
  })
})
