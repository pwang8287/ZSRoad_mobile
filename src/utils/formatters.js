export function formatNumber(value, decimals) {
  const numeric = Number(String(value).replace(/,/g, ''))
  if (!Number.isFinite(numeric)) return value
  const fixed = decimals == null ? String(value).replace(/,/g, '') : numeric.toFixed(decimals)
  const [integer, fraction] = fixed.split('.')
  return `${Number(integer).toLocaleString('en-US')}${fraction ? `.${fraction}` : ''}`
}

export function formatMetricValue(title, value) {
  const raw = String(value).replace(/,/g, '')
  return title === '净利率' ? `${formatNumber(raw.replace('%', ''), 2)}%` : formatNumber(raw)
}

export function formatPercent(value, decimals = 2) {
  if (value === '-' || value === null || value === undefined || value === '') return '-'
  return `${(Number(value) * 100).toFixed(decimals)}%`
}
