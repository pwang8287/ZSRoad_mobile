export function formatNumber(value, decimals) {
  if (value === null || value === undefined || value === '') return '-'
  const numeric = Number(String(value).replace(/,/g, ''))
  if (!Number.isFinite(numeric)) return value
  const fixed = decimals == null ? String(value).replace(/,/g, '') : numeric.toFixed(decimals)
  const [integer, fraction] = fixed.split('.')
  return `${Number(integer).toLocaleString('en-US')}${fraction ? `.${fraction}` : ''}`
}

export function formatAmount(value, decimals = 2) {
  if (value === null || value === undefined || value === '') return '-'
  const numeric = Number(String(value).replace(/,/g, ''))
  return Number.isFinite(numeric) ? formatNumber(numeric, decimals) : '-'
}

export function formatMetricValue(title, value) {
  const raw = String(value).replace(/,/g, '')
  return title === '净利率' ? `${formatNumber(raw.replace('%', ''), 2)}%` : formatNumber(raw)
}

export function formatPercent(value, decimals = 2) {
  if (value === '-' || value === null || value === undefined || value === '') return '-'
  return `${(Number(value) * 100).toFixed(decimals)}%`
}

export function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : date.toISOString()
}
