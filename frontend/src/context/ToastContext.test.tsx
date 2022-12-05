import { ToastProvider, ToastContext } from './ToastContext'

import { act, render, screen, waitFor } from '../../test'

describe('ToastProvider component', () => {
  it('hides toast pop-up alert when open prop is false', async () => {
    await act(() => {
      render({
        ui: <div>Empty content block</div>,
        options: {
          wrapper: ({ children }: { children: React.ReactNode }) => <ToastProvider>{children}</ToastProvider>
        }
      })
    })
    await waitFor(async () => {
      await expect(screen.getByText(/Empty content block/i)).toBeVisible()
      await expect(screen.queryByTestId('toast-alert')).toBeNull()
    })
  })

  it('shows toast pop-up alert when showToast() called on ToastContext', async () => {
    let rendered: any
    await act(async () => {
      rendered = await render({
        ui: (
          <div>
            <ToastContext.Consumer>
              {({ showToast }: { showToast: any }) => (
                <button data-testid="show-toast-btn" onClick={() => showToast('show me')}>
                  Toggle Toast
                </button>
              )}
            </ToastContext.Consumer>
          </div>
        ),
        options: {
          wrapper: ({ children }: { children: React.ReactNode }) => <ToastProvider>{children}</ToastProvider>
        }
      })
    })
    const { user } = rendered
    let showToastButton: any
    await waitFor(async () => {
      await expect(screen.getByText(/Toggle Toast/i)).toBeVisible()
      showToastButton = await screen.getByTestId('show-toast-btn')
    })
    await act(() => {
      user.click(showToastButton)
    })
    await waitFor(async () => {
      await expect(screen.getByTestId('toast-alert')).toBeVisible()
      await expect(screen.getByText(/show me/i)).toBeVisible()
    })
  })

  it('shows toast pop-up in warning severity when type prop set', async () => {
    let rendered: any
    await act(async () => {
      rendered = await render({
        ui: (
          <div>
            <ToastContext.Consumer>
              {({ showToast }: { showToast: any }) => (
                <button data-testid="show-toast-btn" onClick={() => showToast('show me', 'warning')}>
                  Toggle Toast
                </button>
              )}
            </ToastContext.Consumer>
          </div>
        ),
        options: {
          wrapper: ({ children }: { children: React.ReactNode }) => <ToastProvider>{children}</ToastProvider>
        }
      })
    })
    const { user } = rendered
    let showToastButton: any
    await waitFor(async () => {
      await expect(screen.getByText(/Toggle Toast/i)).toBeVisible()
      showToastButton = await screen.getByTestId('show-toast-btn')
    })
    await act(() => {
      user.click(showToastButton)
    })
    await waitFor(async () => {
      const popup = await screen.getByTestId('toast-alert')
      await expect(popup).toBeVisible()
      await expect(popup).toHaveClass('MuiAlert-filledWarning')
      await expect(screen.getByText(/show me/i)).toBeVisible()
    })
  })

  it('hides toast on close click', async () => {
    let rendered: any
    await act(async () => {
      rendered = await render({
        ui: (
          <div>
            <ToastContext.Consumer>
              {({ showToast }: { showToast: any }) => (
                <button data-testid="show-toast-btn" onClick={() => showToast('show me')}>
                  Toggle Toast
                </button>
              )}
            </ToastContext.Consumer>
          </div>
        ),
        options: {
          wrapper: ({ children }: { children: React.ReactNode }) => <ToastProvider>{children}</ToastProvider>
        }
      })
    })
    const { user } = rendered
    let showToastButton: any
    await waitFor(async () => {
      await expect(screen.getByText(/Toggle Toast/i)).toBeVisible()
      showToastButton = await screen.getByTestId('show-toast-btn')
    })
    await act(() => {
      user.click(showToastButton)
    })
    let popup: any
    await waitFor(async () => {
      popup = await screen.getByTestId('toast-alert')
      await expect(popup).toBeVisible()
      await expect(screen.getByText(/show me/i)).toBeVisible()
    })
    await act(async () => {
      await user.click(popup)
    })
    await waitFor(async () => {
      popup = await screen.queryByTestId('toast-alert')
      await expect(popup).toBeNull()
      await expect(screen.queryByTestId('toast-alert')).toBeNull()
    })
  })
})
