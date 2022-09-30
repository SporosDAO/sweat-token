import { act, render, waitFor, screen } from '../../../test'
import ProjectTribute from './ProjectTribute'

describe('Project Tribute Page', () => {
  it('shows alert when user is not connected to a wallet', async () => {
    const { getByText, debug } = render({
      route: '/dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/projects/113/tribute'
    })
    await waitFor(async () => expect(await screen.getByText(/Your wallet has been disconnected/i)).toBeVisible())
  })
})
