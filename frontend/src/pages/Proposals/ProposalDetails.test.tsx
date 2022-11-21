import { ethers } from 'ethers'
import { screen, render, waitFor, within, userEvent, act } from '../../../test'
import * as getProposals from '../../graph/getProposals'
import * as daos from '../../graph/getDAO'
import { addresses } from '../../constants/addresses'
import { defaultAbiCoder as abiCoder, formatEther } from 'ethers/lib/utils'

describe('Proposal Details Page', () => {
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

  it('renders Proposal Details', async () => {
    jest
      .spyOn(getProposals, 'useGetProposal')
      .mockImplementation(
        ({
          chainId,
          daoAddress,
          proposalSerial
        }: {
          chainId: number
          daoAddress: string | undefined
          proposalSerial: number
        }) => {
          const manager = '0xf952a72F39c5Fa22a443200AbE7835128bCb7439'
          const budget = formatEther('101')
          const goalTitle = 'Test a new project proposal'
          const goalLink = 'https://github/some/issue'
          const goalDescription = '1. Write test automation. 2. Conduct user testing.'
          const goals = [{ goalTitle, goalLink, goalDescription }]
          const goalString = JSON.stringify(goals)
          jest.useFakeTimers()
          jest.setSystemTime(new Date(2020, 3, 1))
          const now = new Date()
          const endAsDate = new Date()
          endAsDate.setDate(now.getDate() + 1) // set project deadline one day in the future
          const dateInSecs = Math.floor(endAsDate.getTime() / 1000)
          const payload = abiCoder.encode(
            ['uint256', 'address', 'uint256', 'uint256', 'string'],
            [0, manager, ethers.utils.parseEther(budget), dateInSecs, goalString]
          )
          const PM_CONTRACT = addresses[chainId]['extensions']['projectmanagement']
          const propData = {
            data: {
              data: {
                proposals: [
                  {
                    id: daoAddress,
                    proposer: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
                    proposalType: 'EXTENSION',
                    votes: {},
                    accounts: [PM_CONTRACT],
                    payloads: [payload],
                    dao: {
                      token: {
                        symbol: 'TEST'
                      }
                    }
                  }
                ]
              }
            },
            isSuccess: true
          } as any
          return propData
        }
      )
    await render({
      route: '/dao/chain/5/address/0x3fcdf2b58ba93b1335766f01217b7ede7be61a0a/proposals/6',
      state: { isReadyToProcessImmediately: true }
    })
    await waitFor(() => {
      expect(screen.getByText('Project Management')).toBeVisible()
      //   const memberAddress = screen.getByTestId('member-address')
      //   expect(memberAddress).toBeVisible()
      //   expect(within(memberAddress).getByText('0xf952a72F39c5Fa22a443200AbE7835128bCb7439')).toBeVisible()
      //   const memberShares = screen.getByTestId('member-shares')
      //   expect(memberShares).toBeVisible()
      //   expect(within(memberShares).getByText(/Tokens: 25/i)).toBeVisible()
    })
  })
})
