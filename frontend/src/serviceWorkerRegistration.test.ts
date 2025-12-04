import { register, unregister } from './serviceWorkerRegistration'

const mockSW = {
  ready: {},
  register: jest.fn(),
  controller: undefined as any
}

const mockWinLocation = {
  href: 'http://localhost/',
  origin: 'http://localhost',
  hostname: 'localhost'
}

Object.defineProperty(global.window, 'location', {
  value: mockWinLocation
})

Object.defineProperty(global.navigator, 'serviceWorker', {
  value: mockSW
})

describe('registering service worker', () => {
  const OLD_ENV = process.env
  let mockRegistration = undefined as any
  const config = {
    onUpdate: jest.fn(),
    onSuccess: jest.fn()
  }

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

  test('register service worker in dev mode', async () => {
    process.env = {
      ...OLD_ENV,
      NODE_ENV: 'development'
    }
    await register()
    // no registration in dev mode
    await expect(window.addEventListener).toHaveBeenCalledTimes(0)
  })

  test('register service worker in prod mode on localhost', async () => {
    jest.spyOn(window, 'addEventListener')
    process.env = {
      ...OLD_ENV,
      NODE_ENV: 'production',
      PUBLIC_URL: 'http://localhost/'
    }
    // registration in prod mode
    let onload: any
    ;(window.addEventListener as any).mockImplementation((event: any, callback: any) => {
      onload = callback
    })
    await register()
    await expect(window.addEventListener).toHaveBeenCalledTimes(1)
    await expect(window.addEventListener).toHaveBeenCalledWith('load', expect.anything())
    await expect(onload).toBeTruthy()
    await onload()
    await expect(global.fetch).toHaveBeenCalledWith('http://localhost//service-worker.js', {
      headers: { 'Service-Worker': 'script' }
    })
    await expect(mockSW.register).toHaveBeenCalledTimes(1)
    await expect(mockSW.register).toHaveBeenCalledWith('http://localhost//service-worker.js')
  })

  test('register service worker in prod mode non localhost', async () => {
    jest.spyOn(window, 'addEventListener')
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
    await register(config)
    await expect(window.addEventListener).toHaveBeenCalledTimes(1)
    await expect(window.addEventListener).toHaveBeenCalledWith('load', expect.anything())
    await expect(onload).toBeTruthy()
    await onload()
    await expect(global.fetch).toHaveBeenCalledWith('https://sporosdao.xyz//service-worker.js', {
      headers: { 'Service-Worker': 'script' }
    })
    await expect(navigator.serviceWorker.register).toHaveBeenCalledTimes(1)
  })

  test('when installingworker installed and everything has been precached -> call back config.onUpdate ', async () => {
    jest.spyOn(window, 'addEventListener')
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
    await expect(mockRegistration.onupdatefound).toBeUndefined()
    await register(config)
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
    await mockRegistration.onupdatefound()
    await expect(mockRegistration.installing.onstatechange).toBeTruthy()
    mockRegistration.installing.state = 'installed'
    // simulate SW installing worker state change
    await mockRegistration.installing.onstatechange()
    await expect(config.onUpdate).toHaveBeenCalledTimes(0)
    await expect(config.onSuccess).toHaveBeenCalledTimes(1)
    await expect(config.onSuccess).toHaveBeenCalledWith(mockRegistration)
  })

  test('when installingworker installed and updated content precached but waiting on tabs to close -> call back config.onUpdate ', async () => {
    jest.spyOn(window, 'addEventListener')
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
    await expect(mockRegistration.onupdatefound).toBeUndefined()
    await register(config)
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
    await mockRegistration.onupdatefound()
    await expect(mockRegistration.installing.onstatechange).toBeTruthy()
    mockRegistration.installing.state = 'installed'
    mockSW.controller = jest.fn()
    // simulate SW installing worker state change
    await mockRegistration.installing.onstatechange()
    await expect(config.onUpdate).toHaveBeenCalledTimes(1)
    await expect(config.onUpdate).toHaveBeenCalledWith(mockRegistration)
    await expect(config.onSuccess).toHaveBeenCalledTimes(0)
  })

  test('should not register service worker in prod mode when SW publicUrl.origin does not match window.location.origin', async () => {
    jest.spyOn(window, 'addEventListener')
    const sporosdao = 'sporosdao.xyz'
    process.env = {
      ...OLD_ENV,
      NODE_ENV: 'production',
      PUBLIC_URL: `https://${sporosdao}/`
    }
    mockWinLocation.href = `https://localhost/`
    mockWinLocation.origin = `https://localhost`
    mockWinLocation.hostname = 'localhost'
    // registration in prod mode
    await register()
    await expect(window.addEventListener).toHaveBeenCalledTimes(0)
  })

  test('unregister service worker', async () => {
    await unregister()
    await expect(mockRegistration.unregister).toHaveBeenCalledTimes(1)
  })
})
