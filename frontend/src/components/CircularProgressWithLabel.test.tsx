import CircularProgressWithLabel from './CircularProgressWithLabel'

import { act, render, screen, waitFor, within } from '../../test'

describe('CircularProgressWithLabel component', () => {
  it('shows label and circular progress', async () => {
    await act(() => {
      render({
        ui: <CircularProgressWithLabel value={25} />
      })
    })
    await waitFor(async () => {
      await expect(screen.getByText(/25%/i)).toBeVisible()
      await expect(screen.getByTestId('circular-progress')).toBeVisible()
    })
  })
})
