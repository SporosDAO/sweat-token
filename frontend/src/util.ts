import moment from 'moment'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0 // (causes 2500.99 to be printed as $2,501)
})

/**
 *
 * @param value number or string value of an amount in USD
 * @returns whole number rounded value without '$' prefix
 */
export const formatCurrency = (value: string | number | bigint | undefined): string => {
  if (value === undefined) return ''
  return formatter.format(typeof value === 'string' ? +value : value).substring(1)
}

export const formatDateFromNow = (value: string | Date | undefined): string => {
  if (value === undefined) return ''
  return moment(new Date(value)).fromNow()
}
