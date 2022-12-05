import reportWebVitals from './reportWebVitals'
jest.mock('web-vitals')

test('report web vitals calls back report function', async () => {
  await reportWebVitals(() => ({}))
  const webVitals = await import('web-vitals')
  await expect(webVitals.getCLS).toHaveBeenCalled()
})

test('report web vitals does not call back non-function', async () => {
  await reportWebVitals(undefined)
  const webVitals = await import('web-vitals')
  await expect(webVitals.getCLS).not.toHaveBeenCalled()
})
