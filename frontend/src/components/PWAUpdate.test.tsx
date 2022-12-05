import { ServiceWorkerWrapper } from './PWAUpdate'

import { act, render, screen, waitFor } from '../../test'

const mockSW = {
  ready: {},
  register: jest.fn(),
  controller: undefined as any
}

const mockWinLocation = {
  href: 'http://localhost/',
  origin: 'http://localhost',
  hostname: 'localhost',
  reload: jest.fn()
}

Object.defineProperty(global.window, 'location', {
  value: mockWinLocation
})

Object.defineProperty(global.navigator, 'serviceWorker', {
  value: mockSW
})

describe('PWA version update pop-up', () => {
  const OLD_ENV = process.env
  let mockRegistration = undefined as any

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    jest.spyOn(window, 'addEventListener')
    process.env = { ...OLD_ENV } // Make a copy
    mockRegistration = {
      unregister: jest.fn(),
      onupdatefound: undefined as any,
      installing: {
        onstatechange: undefined as any,
        state: undefined as any
      }
    }
    mockSW.ready = new Promise((resolve, reject) => resolve(mockRegistration as any))
    mockSW.register.mockResolvedValue(mockRegistration)
    global.fetch = jest.fn().mockImplementation(async (swUrl, options) => {
      return {
        status: 200,
        headers: new Map(
          Object.entries({
            'content-type': 'javascript'
          })
        )
      }
    })
  })

  afterAll(() => {
    jest.resetAllMocks()
    process.env = OLD_ENV // Restore old environment
  })

  it('shows pop-up on SW update callback', async () => {
    const sporosdao = 'sporosdao.xyz'
    process.env = {
      ...OLD_ENV,
      NODE_ENV: 'production',
      PUBLIC_URL: `https://${sporosdao}/`
    }
    mockWinLocation.href = `https://${sporosdao}/`
    mockWinLocation.origin = `https://${sporosdao}`
    mockWinLocation.hostname = sporosdao
    // registration in prod mode
    let onload: any
    ;(window.addEventListener as any).mockImplementation((event: any, callback: any) => {
      onload = callback
    })
    jest.spyOn(window, 'addEventListener')

    // open blank page wrapped with all used app providers, including SW provider
    await render({
      ui: <div />,
      options: {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <ServiceWorkerWrapper>{children}</ServiceWorkerWrapper>
        )
      }
    })

    await expect(mockRegistration.onupdatefound).toBeUndefined()
    await waitFor(() => expect(screen.queryByTestId('new-version-alert')).toBeNull())

    // simulate ServiceWorker update
    await expect(window.addEventListener).toHaveBeenCalledTimes(1)
    await expect(window.addEventListener).toHaveBeenCalledWith('load', expect.anything())
    await expect(onload).toBeTruthy()
    await onload()
    await expect(global.fetch).toHaveBeenCalledWith('https://sporosdao.xyz//service-worker.js', {
      headers: { 'Service-Worker': 'script' }
    })
    await expect(navigator.serviceWorker.register).toHaveBeenCalledTimes(1)
    await expect(mockRegistration.installing.onstatechange).toBeFalsy()
    // simulate SW update
    await act(async () => {
      await mockRegistration.onupdatefound()
      await expect(mockRegistration.installing.onstatechange).toBeTruthy()
      mockRegistration.installing.state = 'installed'
      mockSW.controller = jest.fn()
      // simulate SW installing worker state change
      await mockRegistration.installing.onstatechange()
    })
    await waitFor(async () => {
      // SW update pop-up should show
      await expect(screen.queryByTestId('new-version-alert')).toBeVisible()
    })
  })

  it('calls reloadPage on snackbar click', async () => {
    const sporosdao = 'sporosdao.xyz'
    process.env = {
      ...OLD_ENV,
      NODE_ENV: 'production',
      PUBLIC_URL: `https://${sporosdao}/`
    }
    mockWinLocation.href = `https://${sporosdao}/`
    mockWinLocation.origin = `https://${sporosdao}`
    mockWinLocation.hostname = sporosdao
    // registration in prod mode
    let onload: any
    ;(window.addEventListener as any).mockImplementation((event: any, callback: any) => {
      onload = callback
    })
    jest.spyOn(window, 'addEventListener')

    // open blank page wrapped with all used app providers, including SW provider
    let rendered: any
    await act(async () => {
      rendered = await render({
        ui: <div />,
        options: {
          wrapper: ({ children }: { children: React.ReactNode }) => (
            <ServiceWorkerWrapper>{children}</ServiceWorkerWrapper>
          )
        }
      })
    })
    const { user } = rendered

    await expect(mockRegistration.onupdatefound).toBeUndefined()
    await waitFor(() => expect(screen.queryByTestId('new-version-alert')).toBeNull())

    // simulate ServiceWorker update
    await expect(window.addEventListener).toHaveBeenCalledTimes(1)
    await expect(window.addEventListener).toHaveBeenCalledWith('load', expect.anything())
    await expect(onload).toBeTruthy()
    await onload()
    await expect(global.fetch).toHaveBeenCalledWith('https://sporosdao.xyz//service-worker.js', {
      headers: { 'Service-Worker': 'script' }
    })
    await expect(navigator.serviceWorker.register).toHaveBeenCalledTimes(1)
    await expect(mockRegistration.installing.onstatechange).toBeFalsy()
    // simulate SW update
    await act(async () => {
      await mockRegistration.onupdatefound()
      await expect(mockRegistration.installing.onstatechange).toBeTruthy()
      mockRegistration.installing.state = 'installed'
      mockSW.controller = jest.fn()
      // simulate SW installing worker state change
      await mockRegistration.installing.onstatechange()
    })
    let snackbar: any
    await waitFor(async () => {
      snackbar = await screen.getByTestId('new-version-alert')
      await expect(snackbar).toBeEnabled()
      await expect(mockWinLocation.reload).toHaveBeenCalledTimes(0)
    })

    // simulate snackbar button click
    await act(async () => {
      await user.click(snackbar)
    })
    await waitFor(async () => {
      await expect(mockWinLocation.reload).toHaveBeenCalledTimes(1)
    })
  })
})
