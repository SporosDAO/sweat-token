import { ethers } from 'ethers'
import { screen, render, within, act } from '../../../test'
import * as getProposals from '../../graph/getProposals'
import * as daos from '../../graph/getDAO'
import { addresses } from '../../constants/addresses'
import { defaultAbiCoder as abiCoder } from 'ethers/lib/utils'

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

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders PM Proposal Details', async () => {
    const manager = '0xf952a72F39c5Fa22a443200AbE7835128bCb7439'
    const budget = '101'
    const goalTitle = 'Test a new project proposal'
    const goalLink = 'https://github/some/issue'
    const goalDescription = '1.Write test automation. 2.Conduct user testing.'
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2020, 3, 1))
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
          const goals = [{ goalTitle, goalLink, goalDescription }]
          const goalString = JSON.stringify(goals)
          const now = new Date()
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
            data: {
              id: daoAddress,
              serial: 6,
              proposer: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
              proposalType: 'EXTENSION',
              sponsored: true,
              creationTime,
              votingStarts,
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
            isSuccess: true
          } as any
          return propData
        }
      )
    await act(() => {
      render({
        route: '/dao/chain/5/address/0x3fcdf2b58ba93b1335766f01217b7ede7be61a0a/proposals/6',
        state: { isReadyToProcessImmediately: true }
      })
    })
    await expect(screen.getByText('Project Management')).toBeVisible()
    await expect(screen.getByText('By 0xf952a72F39c5Fa22a443200AbE7835128bCb7439')).toBeVisible()
    await expect(screen.getByText(goalTitle)).toBeVisible()
    const m = await screen.getByTestId('manager')
    await expect(m).toBeVisible()
    await expect(within(m).getByText(/Manager/i)).toBeVisible()
    await expect(within(m).getByText(manager)).toBeVisible()
    const b = await screen.getByTestId('budget')
    await expect(b).toBeVisible()
    await expect(within(b).getByText(/Budget/i)).toBeVisible()
    await expect(within(b).getByText(`${budget} TEST`)).toBeVisible()
    const t = await screen.getByTestId('project-deadline')
    await expect(t).toBeVisible()
    await expect(within(t).getByText(/Project Deadline/i)).toBeVisible()
    await expect(within(t).getByText(/4\/2\/2020/i)).toBeVisible()
    const d = await screen.getByTestId('project-description')
    await expect(d).toBeVisible()
    await expect(within(d).getByText(/Project Description/i)).toBeVisible()
    await expect(within(d).getByText(goalDescription)).toBeVisible()
    const l = await screen.getByTestId('project-link')
    await expect(l).toBeVisible()
    await expect(within(l).getByText(/Progress Tracking/i)).toBeVisible()
    await expect(within(l).getByText(goalLink)).toBeVisible()
    const vs = await screen.getByTestId('vote-summary')
    await expect(vs).toBeVisible()
    const vcreated = await within(vs).getByTestId('created-lv')
    await expect(vcreated).toBeVisible()
    await expect(within(vcreated).getByText(/Submitted On/i)).toBeVisible()
    await expect(within(vcreated).getByText(/4\/1\/2020/i)).toBeVisible()
    const vstarts = await within(vs).getByTestId('starts-lv')
    await expect(within(vstarts).getByText(/Voting Start Date/i)).toBeVisible()
    await expect(within(vstarts).getByText(/4\/1\/2020/i)).toBeVisible()
    const vdeadline = await within(vs).getByTestId('deadline-lv')
    await expect(within(vdeadline).getByText(/Voting Deadline/i)).toBeVisible()
    await expect(within(vdeadline).getByText(/4\/4\/2020/i)).toBeVisible()
    const votesTable = await screen.findByTestId('votes-table')
    const voteRows = await within(votesTable).findAllByTestId('vote-row')
    await expect(voteRows.length).toBe(2)
    await expect(voteRows[0]).toBeVisible()
    await expect(await within(voteRows[0]).findByText(manager)).toBeVisible()
    await expect(await within(voteRows[0]).findByText(/2,000/i)).toBeVisible()
    await expect(await within(voteRows[0]).findByTestId(/ThumbUpIcon/i)).toBeVisible()
    await expect(voteRows[1]).toBeVisible()
    await expect(await within(voteRows[1]).findByText(/0xd0d827c41af7bf2e52d1842134d5299ba7d6efc4/i)).toBeVisible()
    await expect(await within(voteRows[1]).findByText(/1,000/i)).toBeVisible()
    await expect(await within(voteRows[1]).findByTestId(/ThumbDownIcon/i)).toBeVisible()
  })

  it('graceful fallback for non-PM Proposals', async () => {
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
          const propData = {
            data: {
              id: daoAddress,
              proposer: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
              proposalType: 'MINT',
              votes: {},
              accounts: [],
              payloads: []
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
    await expect(screen.getByText(/Proposal type\s+MINT\s+not supported/i)).toBeVisible()
  })
})
