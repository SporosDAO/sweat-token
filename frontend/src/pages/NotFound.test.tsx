import { render, waitFor } from '../../test'

describe('Not Found page', () => {
  it('renders a nice 404 page', async () => {
    const { getByText } = render({ route: '/does-not-exist-123123123' })
    await waitFor(async () => {
      await expect(getByText(/Page not found/i)).toBeInTheDocument()
    })
  })
})
