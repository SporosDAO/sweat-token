import { act, screen, render, waitFor, fireEvent, within } from '../../../../test'
import * as daoNames from '../../../graph/getDaoNames'
import * as wagmi from 'wagmi'

describe('DAO Formation - Step DAO Deployment', () => {
  beforeEach(async () => {
    const useGetDaoNames = jest.spyOn(daoNames, 'useGetDaoNames')
    useGetDaoNames.mockImplementation(
      (chainId) =>
        ({
          data: ['TestDao1', 'TestDao2'],
          isSuccess: true
        } as any)
    )

    jest.spyOn(wagmi, 'useNetwork').mockReturnValue({
      chain: {
        id: 5,
        name: 'Goerli'
      }
    } as any)

    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      isDisconnected: false,
      isConnected: true
    } as any)

    jest.spyOn(wagmi, 'useEnsName').mockReturnValue({ data: '', isSuccess: false } as any)

    // open first step in the dao formation flow: DAO name page
    await act(async () => {
      await render({
        route: '/dao/chain/5/create/stepper'
      })
    })

    await act(async () => {
      const daoNameInput = await (await screen.findByTestId('daoname-input')).querySelector('input')
      await fireEvent.change(daoNameInput as Element, { target: { value: 'TestDao3' } })
      const daoSymbolInput = await (await screen.findByTestId('daosymbol-input')).querySelector('input')
      await fireEvent.change(daoSymbolInput as Element, { target: { value: 'TD0123' } })
    })

    // continue to founder page
    await act(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await continueButton.click()
    })

    await act(async () => {
      const founderAddressInput = await (await screen.findByTestId('founder.0.address-input')).querySelector('input')
      await fireEvent.change(founderAddressInput as Element, {
        target: { value: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439' }
      })
      const founderTokensInput = await (await screen.findByTestId('founder.0.tokens-input')).querySelector('input')
      await fireEvent.change(founderTokensInput as Element, { target: { value: '1000' } })
      const founderEmailInput = await (await screen.findByTestId('founder.0.email-input')).querySelector('input')
      await fireEvent.change(founderEmailInput as Element, { target: { value: 'afounder@email.com' } })
    })

    // continue to settings page
    await act(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await continueButton.click()
    })

    // continue to confirmation page
    await act(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await continueButton.click()
    })

    await act(async () => {
      const terms = await (await screen.findByTestId('terms')).querySelector('input')
      await expect(terms).toBeInTheDocument()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fireEvent.click(terms!)
    })

    // continue to deployment page
    await act(async () => {
      const continueButton = await screen.findByTestId('continue-button')
      await continueButton.click()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Shows Deployment step', async () => {
    await waitFor(async () => {
      const header = await screen.getByTestId('content-header')
      await expect(await within(header).findByText(/Deployment/i)).toBeVisible()
    })
  })

  it('Handles on-chain deployment', async () => {
    let txInput: any
    jest.spyOn(wagmi, `usePrepareContractWrite`).mockImplementation((params) => {
      const { onError, ...txin } = params
      txInput = txin
      return {
        config: jest.fn(),
        isError: false,
        error: undefined
      } as any
    })

    jest.spyOn(wagmi, `useContractWrite`).mockReturnValue({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: undefined,
      isIdle: false,
      write: jest.fn()
    } as any)

    await act(async () => {
      const deployButton = await screen.getByTestId('deploy-button')
      await expect(await within(deployButton).findByText(/Deploy Now/i)).toBeVisible()
      await deployButton.click()
    })

    await waitFor(async () => {
      const web3SubmitDialog = await screen.getByTestId('web3dialog')
      await expect(await within(web3SubmitDialog).findByText(/Submitting On-chain Transaction/i)).toBeVisible()
      await expect(txInput).toMatchInlineSnapshot(`
              Object {
                "addressOrName": "0xDDdFf70C77Cffcf97Fb91F7aC4aD0E12E8C14571",
                "args": Array [
                  "TestDao3",
                  "TD0123",
                  "",
                  1,
                  Array [],
                  Array [],
                  Array [
                    "0xf952a72F39c5Fa22a443200AbE7835128bCb7439",
                  ],
                  Array [
                    Object {
                      "hex": "0x3635c9adc5dea00000",
                      "type": "BigNumber",
                    },
                  ],
                  Array [
                    3600,
                    0,
                    20,
                    60,
                    3,
                    3,
                    3,
                    3,
                    3,
                    3,
                    3,
                    3,
                    3,
                    3,
                    3,
                    3,
                  ],
                ],
                "chainId": 5,
                "contractInterface": Array [
                  Object {
                    "inputs": Array [
                      Object {
                        "internalType": "address payable",
                        "name": "kaliMaster_",
                        "type": "address",
                      },
                      Object {
                        "internalType": "contract IRicardianLLC",
                        "name": "ricardianLLC_",
                        "type": "address",
                      },
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor",
                  },
                  Object {
                    "inputs": Array [],
                    "name": "NullDeploy",
                    "type": "error",
                  },
                  Object {
                    "anonymous": false,
                    "inputs": Array [
                      Object {
                        "indexed": true,
                        "internalType": "contract KaliDAO",
                        "name": "kaliDAO",
                        "type": "address",
                      },
                      Object {
                        "indexed": false,
                        "internalType": "string",
                        "name": "name",
                        "type": "string",
                      },
                      Object {
                        "indexed": false,
                        "internalType": "string",
                        "name": "symbol",
                        "type": "string",
                      },
                      Object {
                        "indexed": false,
                        "internalType": "string",
                        "name": "docs",
                        "type": "string",
                      },
                      Object {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "paused",
                        "type": "bool",
                      },
                      Object {
                        "indexed": false,
                        "internalType": "address[]",
                        "name": "extensions",
                        "type": "address[]",
                      },
                      Object {
                        "indexed": false,
                        "internalType": "bytes[]",
                        "name": "extensionsData",
                        "type": "bytes[]",
                      },
                      Object {
                        "indexed": false,
                        "internalType": "address[]",
                        "name": "voters",
                        "type": "address[]",
                      },
                      Object {
                        "indexed": false,
                        "internalType": "uint256[]",
                        "name": "shares",
                        "type": "uint256[]",
                      },
                      Object {
                        "indexed": false,
                        "internalType": "uint32[16]",
                        "name": "govSettings",
                        "type": "uint32[16]",
                      },
                    ],
                    "name": "DAOdeployed",
                    "type": "event",
                  },
                  Object {
                    "inputs": Array [
                      Object {
                        "internalType": "string",
                        "name": "name_",
                        "type": "string",
                      },
                      Object {
                        "internalType": "string",
                        "name": "symbol_",
                        "type": "string",
                      },
                      Object {
                        "internalType": "string",
                        "name": "docs_",
                        "type": "string",
                      },
                      Object {
                        "internalType": "bool",
                        "name": "paused_",
                        "type": "bool",
                      },
                      Object {
                        "internalType": "address[]",
                        "name": "extensions_",
                        "type": "address[]",
                      },
                      Object {
                        "internalType": "bytes[]",
                        "name": "extensionsData_",
                        "type": "bytes[]",
                      },
                      Object {
                        "internalType": "address[]",
                        "name": "voters_",
                        "type": "address[]",
                      },
                      Object {
                        "internalType": "uint256[]",
                        "name": "shares_",
                        "type": "uint256[]",
                      },
                      Object {
                        "internalType": "uint32[16]",
                        "name": "govSettings_",
                        "type": "uint32[16]",
                      },
                    ],
                    "name": "deployKaliDAO",
                    "outputs": Array [
                      Object {
                        "internalType": "contract KaliDAO",
                        "name": "kaliDAO",
                        "type": "address",
                      },
                    ],
                    "stateMutability": "payable",
                    "type": "function",
                  },
                  Object {
                    "inputs": Array [
                      Object {
                        "internalType": "bytes[]",
                        "name": "data",
                        "type": "bytes[]",
                      },
                    ],
                    "name": "multicall",
                    "outputs": Array [
                      Object {
                        "internalType": "bytes[]",
                        "name": "results",
                        "type": "bytes[]",
                      },
                    ],
                    "stateMutability": "payable",
                    "type": "function",
                  },
                ],
                "functionName": "deployKaliDAO",
              }
            `)
    })
  })
})
