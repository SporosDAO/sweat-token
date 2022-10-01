import { act, screen, render, renderHook, waitFor } from '../../../test'
import * as projects from '../../graph/getProjects'
import * as daos from '../../graph/getDAO'

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
})
