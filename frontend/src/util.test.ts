import { formatCurrency, formatDateFromNow } from './util'

describe('registering service worker', () => {
  test('correctness of non-null arg to formatCurrency', async () => {
    const v = formatCurrency(2500.99)
    expect(v).toBe('2,501')
  })

  test('returns blank if undefined argument to formatCurrency', async () => {
    const v = formatCurrency(undefined)
    expect(v).toBe('')
  })

  test('correctness of non-null arg to formatDateFromNow', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2021-10-19'))
    const v = formatDateFromNow('Jan 1, 2009')
    expect(v).toBe('13 years ago')
  })

  test('returns blank if undefined argument', async () => {
    const v = formatDateFromNow(undefined)
    expect(v).toBe('')
  })
})
