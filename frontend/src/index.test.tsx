import * as ReactDOM from 'react-dom/client'
import { unmountComponentAtNode } from 'react-dom'
import { rootRender } from './index'
import { Root } from 'react-dom/client'
import { AppWrapper } from './AppWrapper'

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn().mockReturnValue({
    render: (args: any) => args,
    unmount: jest.fn()
  })
}))

describe('index page', () => {
  let container: HTMLElement
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container)
    container.remove()
  })

  it('render index page', async () => {
    expect(rootRender).toMatchObject(<AppWrapper theme={expect.anything()}>{expect.anything()}</AppWrapper>)
  })
})
