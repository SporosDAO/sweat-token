import { screen, act } from '@testing-library/react'
import ReactDOM from 'react-dom/client'

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
