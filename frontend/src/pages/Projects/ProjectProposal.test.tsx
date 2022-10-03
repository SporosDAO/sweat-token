import { act, screen, render, renderHook, waitFor } from '../../../test'
import * as projects from '../../graph/getProjects'
import * as daos from '../../graph/getDAO'

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
  })

  it('render project proposal form', async () => {
    act(() => {
      render({
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
})
