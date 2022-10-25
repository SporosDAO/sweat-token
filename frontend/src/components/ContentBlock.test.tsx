import ContentBlock from './ContentBlock'

import { act, render, screen, waitFor, within } from '../../test'
import reactRouter from 'react-router-dom'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom')
  return {
    ...originalModule,
    useNavigate: () => mockNavigate
  }
})

describe('ContentBlock component', () => {
  beforeEach(() => {
    //
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  it('shows content block without floating Call-to-Action button when cta prop empty', async () => {
    await act(() => {
      render({
        ui: <ContentBlock>Empty content block</ContentBlock>
      })
    })
    await waitFor(async () => {
      await expect(screen.getByText(/Empty content block/i)).toBeVisible()
      await expect(screen.queryAllByTestId('cta-button')).toMatchObject([])
    })
  })

  it('shows content block with floating Call-to-Action button when cta prop present', async () => {
    let rendered: any
    await act(async () => {
      rendered = await render({
        ui: <ContentBlock cta={{ href: '/some-link', text: 'Click here' }}>Empty content block</ContentBlock>
      })
    })
    const { user } = rendered
    let ctaButton: any
    await waitFor(async () => {
      await expect(screen.getByText(/Empty content block/i)).toBeVisible()
      ctaButton = await screen.getByTestId('cta-button')
      await expect(ctaButton).toBeVisible()
      await expect(within(ctaButton).getByText(/Click here/i)).toBeVisible()
    })
    await act(async () => {
      user.click(ctaButton)
    })
    await waitFor(() => {
      // expect 2 clicks because DAO card itself and Open button link to DAO projects
      expect(mockNavigate).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/some-link')
    })
  })
})
