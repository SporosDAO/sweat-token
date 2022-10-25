import { PageProvider, PageContext } from './index'

import { act, render, screen, userEvent, waitFor } from '../../../test'

describe('PageProvider component', () => {
  it('shows page title from context', async () => {
    await act(async () => {
      await render({
        ui: (
          <PageContext.Consumer>
            {({ title, setTitle }: { title: string; setTitle: any }) => <div>Page title is: {title}</div>}
          </PageContext.Consumer>
        ),
        options: {
          wrapper: ({ children }: { children: React.ReactNode }) => <PageProvider>{children}</PageProvider>
        }
      })
    })
    await waitFor(async () => {
      await expect(screen.getByText(/Page title is: Sporos DAO App/i)).toBeVisible()
    })
  })

  it('shows updated page title dynamically set in context', async () => {
    await act(async () => {
      await render({
        ui: (
          <PageContext.Consumer>
            {({ title, setTitle }: { title: string; setTitle: any }) => (
              <div>
                <button data-testid="set-title-btn" onClick={() => setTitle('New Page Title')}>
                  Change Page Title
                </button>
                <div>Page title is: {title}</div>
              </div>
            )}
          </PageContext.Consumer>
        ),
        options: {
          wrapper: ({ children }: { children: React.ReactNode }) => <PageProvider>{children}</PageProvider>
        }
      })
    })
    await act(async () => {
      const changeTitleButton = await screen.getByTestId('set-title-btn')
      await userEvent.click(changeTitleButton)
    })
    await waitFor(async () => {
      await expect(screen.queryByText(/Sporos DAO App/i)).toBeNull()
      await expect(screen.getByText(/Page title is:/i)).toBeVisible()
      await expect(screen.getByText(/New Page Title/i)).toBeVisible()
    })
  })
})
