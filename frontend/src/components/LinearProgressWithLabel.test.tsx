import LinearProgressWithLabel from './LinearProgressWithLabel'

import { act, render, screen, waitFor } from '../../test'

describe('LinearProgressWithLabel component', () => {
  it('shows label and circular progress', async () => {
    await act(() => {
      render({
        ui: <LinearProgressWithLabel value={25} />
      })
    })
    await waitFor(async () => {
      await expect(screen.getByText(/25%/i)).toBeVisible()
      await expect(screen.getByTestId('linear-progress')).toBeVisible()
    })
  })
})
