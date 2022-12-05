import { act, screen, render, waitFor, fireEvent, userEvent, within } from '../../../test'
import * as projects from '../../graph/getProjects'
import * as daos from '../../graph/getDAO'
import * as reactDom from 'react-router-dom'
import ProjectTribute from './ProjectTribute'
import * as wagmi from 'wagmi'

jest.mock('react-router-dom', () => {
  return {
    __esModule: true, //    <----- allows use of jest.spyOn
    ...jest.requireActual('react-router-dom')
  }
})

describe('Project Tribute Page', () => {
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
  })

  it('redirect to home page when no project in context', async () => {
    await act(() => {
      render({
        route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/projects/113/tribute'
      })
    })
    // Expect to redirect to home page when visited out of context.
    await waitFor(() => expect(document.location.pathname).toBe('/'))
  })

  it('shows alerts when in context', async () => {
    const useGetProjects = jest.spyOn(projects, 'useGetProjects')
    // mock project data
    useGetProjects.mockImplementation(
      (chainId, daoId) =>
        ({
          projects: [
            {
              manager: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
              projectID: '113',
              budget: 123,
              goals: [{ goalTitle: '100% test coverage', goalLink: '' }]
            }
          ],
          error: undefined,
          isLoading: false
        } as any)
    )
    // navigate to projects page
    const { user, getByTestId } = await render({
      route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/projects/'
    })
    // Connect to wallet in order to see Tribute button
    const connectButton = getByTestId('btn-mock-connect')
    await act(async () => {
      await user.click(connectButton)
    })
    // after user connects to wallet, a disconnect button should appear
    // it takes some extra time to disconnect, hence use of waitFor
    await waitFor(async () => {
      await expect(getByTestId('btn-mock-disconnect')).toBeVisible()
      // project card should show up for mocked project
    })
    const tributeButton = await getByTestId('tribute-button-113')
    // navigate to project tribute page
    await act(async () => {
      await user.click(tributeButton)
    })
    // when user is manage tribute submit form should be visible
    await expect(getByTestId('submit-button')).toBeEnabled()
    // now disconnect user to see if alert appears
    let disconnectButton: Element
    await waitFor(async () => {
      disconnectButton = await getByTestId('btn-mock-disconnect')
      // navigate to project tribute page
    })
    await act(async () => {
      await user.click(disconnectButton)
    })
    await waitFor(() => expect(screen.getByText(/Your wallet has been disconnected/i)).toBeVisible())
  })

  it('onClose callback hides dialog', async () => {
    jest
      .spyOn(reactDom, 'useParams')
      .mockReturnValue({ chainId: '5', daoId: '0xe237747055b12f4da323bc559ac8d5eb66aac2f7', projectId: '113' })
    jest.spyOn(reactDom, 'useLocation').mockReturnValue({
      state: { manager: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439', budget: '101', goals: '', deadline: '123' },
      key: '',
      pathname: '',
      search: '',
      hash: ''
    })
    jest.spyOn(wagmi, 'useAccount').mockReturnValue({
      address: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
      isDisconnected: false,
      connector: undefined,
      isConnected: true,
      isReconnecting: false,
      isConnecting: false,
      status: 'connected'
    } as any)

    await render({
      ui: <ProjectTribute />
    })

    // populate form with a valid tribute
    const contributor = (await screen.findByTestId('contributor-input')).querySelector('input')
    await expect(contributor).toBeVisible()
    await fireEvent.change(contributor as Element, { target: { value: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439' } })
    await expect(contributor?.value).toBe('0xf952a72F39c5Fa22a443200AbE7835128bCb7439')
    const amount = (await screen.findByTestId('amount-input')).querySelector('input')
    await expect(amount).toBeInTheDocument()
    await fireEvent.change(amount as Element, { target: { value: '100' } })
    await expect(amount?.value).toBe('100')
    const title = await screen.getByTestId('title-input').querySelector('input')
    await expect(title).toBeInTheDocument()
    await fireEvent.change(title as Element, {
      target: { value: '100% test coverage' }
    })
    await expect(title?.value).toBe('100% test coverage')
    const link = await screen.getByTestId('link-input').querySelector('input')
    await expect(link).toBeInTheDocument()
    await fireEvent.change(link as Element, {
      target: { value: 'https://github.com/SporosDAO/sweat-token/issues/80' }
    })
    await expect(link?.value).toBe('https://github.com/SporosDAO/sweat-token/issues/80')

    await act(() => {
      waitFor(() => {
        // submit proposal
        userEvent.click(screen.getByTestId('submit-button'))
      })
    })

    let web3Close: Element
    await waitFor(() => {
      const web3Dialog = screen.getByTestId('web3dialog')
      expect(web3Dialog).toBeVisible()
      const web3Submit = within(web3Dialog).getByTestId('web3submit-alert-dialog-title')
      expect(web3Submit).toBeVisible()
      web3Close = within(web3Dialog).getByTestId('close-button')
      expect(web3Close).toBeVisible()
    })

    await act(() => {
      waitFor(() => {
        userEvent.click(web3Close)
      })
    })

    await waitFor(() => {
      expect(screen.queryByTestId('web3dialog')).toBeNull()
    })
  })
})
