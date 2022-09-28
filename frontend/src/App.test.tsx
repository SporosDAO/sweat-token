import ReactDOM from 'react-dom/client'
import App from './App'
import {
  Providers,
  UserEvent,
  act,
  addressRegex,
  getSigners,
  render,
  screen,
  setupClient,
  userEvent,
  waitFor
} from '../test'

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

describe('<Connect />', () => {
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
    // Connect to wallet
    // const connectButton = screen.getByRole('button', { name: 'Mock' })
    // act(() => {
    //   user.click(connectButton)
    // })
  })
})
