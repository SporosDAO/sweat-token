import { ethers } from 'ethers'
import { screen, render, within, act, userEvent } from '../../../test'
import * as getProposals from '../../graph/getProposals'
import * as daos from '../../graph/getDAO'
import { addresses } from '../../constants/addresses'
import { defaultAbiCoder as abiCoder } from 'ethers/lib/utils'
import * as reactDom from 'react-router-dom'

jest.mock('react-router-dom', () => {
  return {
    __esModule: true, //    <----- allows use of jest.spyOn
    ...jest.requireActual('react-router-dom')
  }
})

describe('Proposals list page', () => {
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

  it('renders a list of proposals', async () => {
    const manager = '0xf952a72F39c5Fa22a443200AbE7835128bCb7439'
    const budget = '101'
    const goalTitle = 'Test a new project proposal'
    const goalLink = 'https://github/some/issue'
    const goalDescription = '1.Write test automation. 2.Conduct user testing.'
    jest
      .spyOn(getProposals, 'useGetProposals')
      .mockImplementation(({ chainId, daoAddress }: { chainId: number; daoAddress: string | undefined }) => {
        const goals = [{ goalTitle, goalLink, goalDescription }]
        const goalString = JSON.stringify(goals)
        const now = new Date(2019, 3, 1)
        const creationTime = Math.floor(now.getTime() / 1000)
        const votingStarts = creationTime
        const endAsDate = new Date()
        endAsDate.setDate(now.getDate() + 1) // set project deadline one day in the future
        const dateInSecs = Math.floor(endAsDate.getTime() / 1000)
        const payload = abiCoder.encode(
          ['uint256', 'address', 'uint256', 'uint256', 'string'],
          [0, manager, ethers.utils.parseEther(budget), dateInSecs, goalString]
        )
        const PM_CONTRACT = addresses[chainId]['extensions']['projectmanagement']
        const propData = {
          data: [
            {
              id: 1,
              serial: 6,
              proposer: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
              proposalType: 'EXTENSION',
              sponsored: true,
              creationTime,
              votingStarts,
              status: null,
              votes: [
                {
                  voter: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
                  weight: '2000000000000000000000',
                  vote: true
                },
                {
                  voter: '0xd0d827c41af7bf2e52d1842134d5299ba7d6efc4',
                  weight: '1000000000000000000000',
                  vote: false
                }
              ],
              accounts: [PM_CONTRACT],
              payloads: [payload],
              dao: {
                token: {
                  symbol: 'TEST',
                  totalSupply: '3000000000000000000000'
                },
                votingPeriod: 60 * 60 * 24 * 3, // 3 days
                quorum: 51 // 51%
              }
            },
            {
              id: 2,
              serial: 7,
              proposer: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
              proposalType: 'EXTENSION',
              sponsored: true,
              creationTime,
              votingStarts,
              status: true,
              votes: [
                {
                  voter: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
                  weight: '2000000000000000000000',
                  vote: true
                },
                {
                  voter: '0xd0d827c41af7bf2e52d1842134d5299ba7d6efc4',
                  weight: '1000000000000000000000',
                  vote: false
                }
              ],
              accounts: [PM_CONTRACT],
              payloads: [payload],
              dao: {
                token: {
                  symbol: 'TEST',
                  totalSupply: '3000000000000000000000'
                },
                votingPeriod: 60 * 60 * 24 * 3, // 3 days
                quorum: 51 // 51%
              }
            },
            {
              id: 3,
              serial: 8,
              proposer: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
              proposalType: 'EXTENSION',
              sponsored: true,
              creationTime,
              votingStarts,
              status: true,
              votes: [
                {
                  voter: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
                  weight: '2000000000000000000000',
                  vote: true
                },
                {
                  voter: '0xd0d827c41af7bf2e52d1842134d5299ba7d6efc4',
                  weight: '1000000000000000000000',
                  vote: false
                }
              ],
              accounts: [], // unknown extension type
              payloads: [],
              dao: {
                token: {
                  symbol: 'TEST',
                  totalSupply: '3000000000000000000000'
                },
                votingPeriod: 60 * 60 * 24 * 3, // 3 days
                quorum: 51 // 51%
              }
            }
          ],
          isSuccess: true
        } as any
        return propData
      })
    jest.useFakeTimers().setSystemTime(new Date(2022, 3, 1))
    await act(() => {
      render({
        route: '/dao/chain/5/address/0x3fcdf2b58ba93b1335766f01217b7ede7be61a0a/proposals'
      })
    })
    const propCards = await screen.findAllByTestId('proposal-card')
    await expect(propCards.length).toBe(3)
    const serial6 = await within(propCards[0]).findByTestId('prop-serial')
    await expect(await within(serial6).findByText(/#\s*6/i)).toBeVisible()
    await expect(await within(propCards[0]).findByText(/NEW PROJECT/i)).toBeVisible()
    const serial7 = await within(propCards[1]).findByTestId('prop-serial')
    await expect(await within(serial7).findByText(/#\s*7/i)).toBeVisible()
    await expect(await within(propCards[1]).findByText(/NEW PROJECT/i)).toBeVisible()
    const serial8 = await within(propCards[2]).findByTestId('prop-serial')
    await expect(await within(serial8).findByText(/#\s*8/i)).toBeVisible()
    await expect(await within(propCards[2]).findByText(/UNKNOWN EXTENSION/i)).toBeVisible()
  })

  it('shows next proposal ready to process and handles its button', async () => {
    const manager = '0xf952a72F39c5Fa22a443200AbE7835128bCb7439'
    const budget = '101'
    const goalTitle = 'Test a new project proposal'
    const goalLink = 'https://github/some/issue'
    const goalDescription = '1.Write test automation. 2.Conduct user testing.'
    jest
      .spyOn(getProposals, 'useGetProposals')
      .mockImplementation(({ chainId, daoAddress }: { chainId: number; daoAddress: string | undefined }) => {
        const goals = [{ goalTitle, goalLink, goalDescription }]
        const goalString = JSON.stringify(goals)
        const now = new Date(2019, 3, 1)
        const creationTime = Math.floor(now.getTime() / 1000)
        const votingStarts = creationTime
        const endAsDate = new Date()
        endAsDate.setDate(now.getDate() + 1) // set project deadline one day in the future
        const dateInSecs = Math.floor(endAsDate.getTime() / 1000)
        const payload = abiCoder.encode(
          ['uint256', 'address', 'uint256', 'uint256', 'string'],
          [0, manager, ethers.utils.parseEther(budget), dateInSecs, goalString]
        )
        const PM_CONTRACT = addresses[chainId]['extensions']['projectmanagement']
        const propData = {
          data: [
            {
              id: 1,
              serial: 6,
              proposer: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
              proposalType: 'EXTENSION',
              sponsored: true,
              creationTime,
              votingStarts,
              status: null,
              votes: [
                {
                  voter: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
                  weight: '2000000000000000000000',
                  vote: true
                },
                {
                  voter: '0xd0d827c41af7bf2e52d1842134d5299ba7d6efc4',
                  weight: '1000000000000000000000',
                  vote: false
                }
              ],
              accounts: [PM_CONTRACT],
              payloads: [payload],
              dao: {
                token: {
                  symbol: 'TEST',
                  totalSupply: '3000000000000000000000'
                },
                votingPeriod: 60 * 60 * 24 * 3, // 3 days
                quorum: 51 // 51%
              }
            },
            {
              id: 2,
              serial: 7,
              proposer: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
              proposalType: 'EXTENSION',
              sponsored: true,
              creationTime,
              votingStarts,
              status: true,
              votes: [
                {
                  voter: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
                  weight: '2000000000000000000000',
                  vote: true
                },
                {
                  voter: '0xd0d827c41af7bf2e52d1842134d5299ba7d6efc4',
                  weight: '1000000000000000000000',
                  vote: false
                }
              ],
              accounts: [PM_CONTRACT],
              payloads: [payload],
              dao: {
                token: {
                  symbol: 'TEST',
                  totalSupply: '3000000000000000000000'
                },
                votingPeriod: 60 * 60 * 24 * 3, // 3 days
                quorum: 51 // 51%
              }
            }
          ],
          isSuccess: true
        } as any
        return propData
      })
    jest.useFakeTimers().setSystemTime(new Date(2022, 3, 1))
    const mockNavigate = jest.fn()
    jest.spyOn(reactDom, 'useNavigate').mockReturnValue(mockNavigate)
    await render({
      route: '/dao/chain/5/address/0x3fcdf2b58ba93b1335766f01217b7ede7be61a0a/proposals'
    })
    const propCards = await screen.findAllByTestId('proposal-card')
    await expect(propCards.length).toBe(2)
    const serial6 = await within(propCards[0]).findByTestId('prop-serial')
    await expect(await within(serial6).findByText(/#\s*6/i)).toBeVisible()
    const serial7 = await within(propCards[1]).findByTestId('prop-serial')
    await expect(await within(serial7).findByText(/#\s*7/i)).toBeVisible()
    const contentAlert = await screen.findByTestId('toast-alert')
    await expect(contentAlert).toBeVisible()
    const nextPropButton = await within(contentAlert).findByTestId('next-prop-button')
    await expect(nextPropButton).toBeVisible()
    await expect(nextPropButton).toBeEnabled()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    await act(async () => {
      await user.click(nextPropButton)
    })
    await expect(mockNavigate).toBeCalledTimes(1)
    await expect(mockNavigate).toHaveBeenCalledWith('./6', expect.anything())
    const propDetailsBtn = await within(propCards[0]).findByTestId('prop-details-button')
    await act(async () => {
      await user.click(propDetailsBtn)
    })
    await expect(mockNavigate).toBeCalledTimes(2)
    await expect(mockNavigate).toHaveBeenCalledWith('./6', expect.anything())
  })

  it('handles data fetch errors', async () => {
    jest
      .spyOn(getProposals, 'useGetProposals')
      .mockImplementation(({ chainId, daoAddress }: { chainId: number; daoAddress: string | undefined }) => {
        const propData = {
          data: [],
          isSuccess: false,
          isError: true,
          isLoading: false,
          error: 'Loading Error'
        } as any
        return propData
      })
    await act(() => {
      render({
        route: '/dao/chain/5/address/0x3fcdf2b58ba93b1335766f01217b7ede7be61a0a/proposals'
      })
    })
    const loadingError = await screen.findByTestId('loading-error')
    await expect(loadingError).toBeVisible()
  })

  it('handles DAOs without proposals', async () => {
    jest
      .spyOn(getProposals, 'useGetProposals')
      .mockImplementation(({ chainId, daoAddress }: { chainId: number; daoAddress: string | undefined }) => {
        const propData = {
          data: [],
          isSuccess: true,
          isError: false,
          isLoading: false
        } as any
        return propData
      })
    await act(() => {
      render({
        route: '/dao/chain/5/address/0x3fcdf2b58ba93b1335766f01217b7ede7be61a0a/proposals'
      })
    })
    const noProps = await screen.findByText(/This DAO has no proposals yet/i)
    await expect(noProps).toBeVisible()
  })
})
