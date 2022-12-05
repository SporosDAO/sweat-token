import App from './App'
import { act, render, screen, waitFor, addressRegex } from '../test'

describe('Landing page', () => {
  it('render landing page', async () => {
    const { getByText, queryByText } = render({ route: '/' })
    await act(async () => {
      await expect(getByText(/The Launchpad of For-Profit DAOs/i)).toBeInTheDocument()
      await expect(queryByText('nonsense')).toBeNull()
    })
  })

  it('connects and disconnects web3 wallet', async () => {
    const { user, getByText, getByTestId } = render({ ui: <App /> })

    // Connect to wallet
    const connectButton = getByTestId('btn-mock-connect')
    await act(async () => {
      await user.click(connectButton)
    })
    await waitFor(() => expect(getByText(addressRegex)).toBeInTheDocument())
    // Disconnect
    const disconnectButton = getByTestId('btn-mock-disconnect')
    expect(disconnectButton).toHaveTextContent(/disconnect/i)
    await act(async () => {
      await user.click(disconnectButton)
    })
    expect(screen.getByTestId('btn-mock-connect')).toHaveTextContent('Mock')
  })
})
