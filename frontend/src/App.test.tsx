import ReactDOM from 'react-dom/client'
import App from './App'
import { UserEvent, act, render, screen, userEvent, waitFor, addressRegex } from '../test'

let container: Element | undefined

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container as Element)
  container = undefined
})

test('renders learn react link', () => {
  act(() => {
    ReactDOM.createRoot(container as Element).render(<div>learn react</div>)
  })
  const textElement = screen.getByText(/learn react/i)
  expect(textElement).toBeInTheDocument()
})

describe('Landing page', () => {
  let user: UserEvent
  beforeEach(() => {
    user = userEvent.setup()
  })

  it('render landing page', async () => {
    render(<App />)
    await act(async () => {
      await expect(screen.getByText('The Launchpad of For-Profit DAOs')).toBeInTheDocument()
      await expect(screen.queryByText('nonsense')).toBeNull()
    })
  })

  it('connects and disconnects web3 wallet', async () => {
    render(<App />)

    // Connect to wallet
    const connectButton = screen.getByTestId('btn-mock-connect')
    await act(async () => {
      await user.click(connectButton)
    })
    await waitFor(() => expect(screen.getByText(addressRegex)).toBeInTheDocument(), { timeout: 3000 })
    // Disconnect
    const disconnectButton = screen.getByTestId('btn-mock-disconnect')
    expect(disconnectButton).toHaveTextContent(/disconnect/i)
    await act(async () => {
      await user.click(disconnectButton)
    })
    expect(screen.getByTestId('btn-mock-connect')).toHaveTextContent('Mock')
  })
})
