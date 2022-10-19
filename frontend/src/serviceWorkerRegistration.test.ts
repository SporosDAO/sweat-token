import { extractEventHandlers } from '@mui/base'
import { TsJestCompiler } from 'ts-jest'
import { register, unregister } from './serviceWorkerRegistration'

const mockSW = {
  ready: {},
  register: jest.fn()
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
  const mockRegistration = {
    unregister: jest.fn()
  }

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    jest.resetAllMocks()
    process.env = { ...OLD_ENV } // Make a copy
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
    process.env = OLD_ENV // Restore old environment
  })

  test('register service worker in dev mode', async () => {
    jest.spyOn(window, 'addEventListener')
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
    await register()
    await expect(window.addEventListener).toHaveBeenCalledTimes(1)
    await expect(window.addEventListener).toHaveBeenCalledWith('load', expect.anything())
    await expect(onload).toBeTruthy()
    await onload()
    await expect(global.fetch).toHaveBeenCalledWith('https://sporosdao.xyz//service-worker.js', {
      headers: { 'Service-Worker': 'script' }
    })
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
