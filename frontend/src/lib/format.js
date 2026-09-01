const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return currencyFormatter.format(value)
}

export function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return numberFormatter.format(Number(value.toFixed?.(digits) ?? value))
}
