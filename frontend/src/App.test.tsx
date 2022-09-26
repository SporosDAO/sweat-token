import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { renderApp } from './RenderApp'
import ReactDOM from 'react-dom/client'

test('renders learn react link', () => {
  render(<div>learn react</div>)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})

test('renders Sporos DAO landing page', () => {
  // Test first render and componentDidMount
  act(() => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = ReactDOM.createRoot(container)
    renderApp(root)
  })
  const linkElement = screen.getByText(/The Launchpad of For-Profit DAOs/i)
  expect(linkElement).toBeInTheDocument()
})
