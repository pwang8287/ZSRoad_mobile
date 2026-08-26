import React, { memo, useEffect, useRef } from 'react'
import { init, use } from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { DataZoomComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, LineChart, DataZoomComponent, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer])

const colors = { primary: '#036CFF', teal: '#13CDB0', orange: '#FFB400', grid: '#D5DAE4', text: '#1A1A1A', tertiary: 'rgba(26,26,26,.48)' }
const formatChartNumber = value => Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formatAxisNumber = value => Number(value).toLocaleString('en-US')
function dynamicAxis(values, preferred = 50) {
  const finiteValues = values.map(Number).filter(Number.isFinite)
  const max = Math.max(...finiteValues, 1)
  const magnitude = 10 ** Math.floor(Math.log10(max))
  const interval = max / magnitude < 2 ? magnitude / 5 : max / magnitude < 5 ? magnitude / 2 : magnitude
  const step = Math.max(preferred, interval)
  return { max: Math.max(step, Math.ceil(max / step) * step), interval: step }
}
function dynamicBarWidth(categoryCount, seriesCount, base = 190) { return Math.max(8, Math.min(22, Math.floor(base / Math.max(categoryCount, 1) / Math.max(seriesCount, 1)))) }
function Chart({ option, height }) {
  const ref = useRef(null)
  const chartRef = useRef(null)
  useEffect(() => {
    if (!ref.current) return undefined
    const chart = init(ref.current)
    chartRef.current = chart
    const onResize = () => chart.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      chart.dispose()
      chartRef.current = null
    }
  }, [])
  useEffect(() => { chartRef.current?.setOption(option, { notMerge: true }) }, [option])
  return <div className="echart" ref={ref} style={{ height }} />
}
const dataZoom = [{ type: 'inside', xAxisIndex: 0, filterMode: 'none', start: 0, end: 65, zoomOnMouseWheel: false, moveOnMouseMove: true, moveOnMouseWheel: true }]
const tooltip = { trigger: 'axis', backgroundColor: '#fff', borderColor: colors.grid, textStyle: { color: colors.text, fontSize: 12 }, valueFormatter: value => `${formatChartNumber(value)} 万元`, extraCssText: 'box-shadow:0 4px 12px rgba(26,26,26,.12);' }
const commonY = { type: 'value', min: -50, max: 250, interval: 50, name: '万元', nameLocation: 'end', nameRotate: 0, nameGap: 8, nameTextStyle: { color: colors.tertiary, fontSize: 12, align: 'right', padding: [0, 0, 0, 0] }, axisLabel: { color: colors.tertiary, fontSize: 12, margin: 8, formatter: formatAxisNumber }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: colors.grid, type: 'dashed' } } }

function EProfitTrendView({ data, period = '当月' } = {}) {
  const months = ['8月','9月','10月','11月','2025年12月','2026年1月','2月','3月','4月','5月','6月','7月']
  const chartData = data || { profit: [100,120,230,100,130,165,195,205,180,140,210,145], income: [150,100,200,100,220,230,230,120,100,210,215,145], cost: [125,120,130,170,120,165,130,225,100,150,205,125] }
  const scale = period === '年累计' ? 1.18 : 1
  const option = { animationDuration: 500, grid: { left: 34, right: 8, top: 38, bottom: 88 }, dataZoom, legend: { top: 'auto', bottom: 4, left: 'center', itemWidth: 14, itemHeight: 2, itemGap: 13, textStyle: { color: colors.text, fontSize: 12 }, data: ['利润','收入','成本'] }, tooltip, xAxis: { type: 'category', data: months, boundaryGap: false, axisLine: { lineStyle: { color: colors.grid } }, axisTick: { show: false }, axisLabel: { color: colors.tertiary, fontSize: 12, rotate: 0, interval: 0, formatter: (value, index) => (index % 5 === 0 || value.includes('12月') || value.includes('1月')) ? value : '' } }, yAxis: commonY, series: [{ name: '利润', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, itemStyle: { color: colors.primary }, lineStyle: { color: colors.primary, width: 2 }, areaStyle: { color: 'rgba(3,108,255,.05)' }, data: chartData.profit.map(value => value * scale) }, { name: '收入', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, itemStyle: { color: colors.teal }, lineStyle: { color: colors.teal, width: 2 }, data: chartData.income.map(value => value * scale) }, { name: '成本', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, itemStyle: { color: colors.orange }, lineStyle: { color: colors.orange, width: 2 }, data: chartData.cost.map(value => value * scale) }] }
  const axis = dynamicAxis([...chartData.profit, ...chartData.income, ...chartData.cost].map(value => value * scale), 50)
  option.yAxis = { ...commonY, min: 0, max: axis.max, interval: axis.interval }
  option.xAxis.axisLabel.rotate = 30
  return <div className="trend-scroll" aria-label="利润趋势图，可在图表内水平滑动查看"><Chart option={option} height={335} /></div>
}
export const EProfitTrend = memo(EProfitTrendView)

function ECostTrendView({ period = '当月' } = {}) {
  const now = new Date()
  const months = Array.from({ length: 12 }, (_, index) => { const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1); const month = date.getMonth() + 1; return { label: month === 12 || month === 1 ? `${date.getFullYear()}年${month}月` : `${month}月`, year: date.getFullYear(), month } })
  const scale = period === '年累计' ? 1.18 : 1
  const option = { grid: { left: 34, right: 8, top: 30, bottom: 82 }, dataZoom: [{ type: 'inside', xAxisIndex: 0, filterMode: 'none', start: 0, end: 58, zoomOnMouseWheel: false, moveOnMouseMove: true, moveOnMouseWheel: true }], legend: { bottom: 4, left: 'center', itemWidth: 14, itemHeight: 2, textStyle: { color: colors.text, fontSize: 11 }, data: ['经营成本','去年同期'] }, tooltip, xAxis: { type: 'category', data: months.map(item => item.label), axisLine: { lineStyle: { color: colors.grid } }, axisTick: { show: false }, axisLabel: { color: colors.text, fontSize: 10, rotate: 30, interval: 0 } }, yAxis: { ...commonY, min: 0, max: 250, interval: 50 }, series: [{ name: '经营成本', type: 'line', smooth: true, symbol: 'circle', symbolSize: 4, areaStyle: { color: 'rgba(3,108,255,.16)' }, lineStyle: { color: '#036CFF', width: 2 }, itemStyle: { color: '#036CFF' }, data: [100,140,230,100,130,150,170,190,160,180,210,190].map(value => value * scale) }, { name: '去年同期', type: 'line', smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { color: '#B8B8B8', width: 2 }, itemStyle: { color: '#B8B8B8' }, data: [150,100,200,140,100,210,120,190,170,210,130,150].map(value => value * scale) }] }
  const axis = dynamicAxis([[100,140,230,100,130,150,170,190,160,180,210,190],[150,100,200,140,100,210,120,190,170,210,130,150]].flat().map(value => value * scale), 50)
  option.yAxis.max = axis.max
  option.yAxis.interval = axis.interval
  return <Chart option={option} height={300} />
}
export const ECostTrend = memo(ECostTrendView)

function ERevenueTrendView({ period = '当月' } = {}) {
  const months = ['2025年12月', '2026年1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月']
  const scale = period === '年累计' ? 1.18 : 1
  const option = {
    animationDuration: 500,
    grid: { left: 38, right: 42, top: 38, bottom: 106 },
    legend: [
      { bottom: 30, left: 'center', itemWidth: 12, itemHeight: 2, itemGap: 6, textStyle: { color: colors.text, fontSize: 11 }, data: ['通行费收入', '免费金额', '通行费收入(去年)', '免费金额(去年)'] },
      { bottom: 4, left: 'center', itemWidth: 12, itemHeight: 10, itemGap: 24, textStyle: { color: colors.text, fontSize: 11 }, data: ['客车流量', '货车流量'] }
    ],
    dataZoom: months.length > 6 ? [{ type: 'inside', xAxisIndex: 0, filterMode: 'none', start: 0, end: 58, zoomOnMouseWheel: false, moveOnMouseMove: true, moveOnMouseWheel: true }] : [],
    tooltip: { ...tooltip, formatter: params => { const list = Array.isArray(params) ? params : [params]; const title = list[0]?.axisValueLabel || ''; return [title, ...list.map(item => `${item.marker}${item.seriesName}: ${formatChartNumber(item.value)} ${item.seriesName.includes('流量') ? '万辆' : '万元'}`)].join('<br/>') } },
    xAxis: { type: 'category', data: months, boundaryGap: true, axisLine: { lineStyle: { color: colors.grid } }, axisTick: { show: false }, axisLabel: { color: colors.tertiary, fontSize: 10, rotate: 30, interval: 0 } },
    yAxis: [{ ...commonY, min: 0, max: 250, interval: 50, name: '万元' }, { ...commonY, min: 0, max: 250, interval: 50, name: '万辆', position: 'right', nameLocation: 'end', nameGap: 8, nameTextStyle: { color: colors.tertiary, fontSize: 12, align: 'left', padding: [0, 0, 0, 0] }, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: true, color: colors.tertiary, fontSize: 12, margin: 8, formatter: formatAxisNumber }, splitLine: { show: false } }],
    series: [
      { name: '客车流量', type: 'bar', yAxisIndex: 1, barWidth: 14, barGap: '10%', itemStyle: { color: '#B179F1' }, data: [136, 176, 188, 174, 126, 201, 168, 184, 155, 172, 160, 180].map(value => value * scale) },
      { name: '货车流量', type: 'bar', yAxisIndex: 1, barWidth: 14, itemStyle: { color: '#61B8C0' }, data: [209, 158, 108, 205, 233, 153, 186, 202, 171, 185, 192, 178].map(value => value * scale) },
      { name: '通行费收入', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, itemStyle: { color: colors.teal }, lineStyle: { color: colors.teal, width: 2 }, data: [26, 30, 33, 36, 39, 47, 42, 44, 48, 51, 46, 49].map(value => value * scale) },
      { name: '免费金额', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, itemStyle: { color: '#F39A38' }, lineStyle: { color: '#F39A38', width: 2 }, data: [21, 26, 30, 33, 35, 40, 37, 40, 42, 45, 43, 46].map(value => value * scale) },
      { name: '通行费收入(去年)', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, itemStyle: { color: '#999' }, lineStyle: { color: '#999', width: 2 }, data: [174, 204, 42, 47, 68, 123, 42, 74, 113, 98, 88, 105].map(value => value * scale) },
      { name: '免费金额(去年)', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, itemStyle: { color: '#D0D0D0' }, lineStyle: { color: '#D0D0D0', width: 2 }, data: [122, 174, 136, 105, 42, 48, 102, 90, 76, 98, 110, 118].map(value => value * scale) }
    ]
  }
  return <Chart option={option} height={350} />
}
export const ERevenueTrend = memo(ERevenueTrendView)

function ECompanyBarsView({ data, period = '当月', names: namesProp } = {}) {
  const names = namesProp || ['甬台温高速','宁波交通科技','九龙高速','桂林公司','京津塘高速','贵黄公司','鄂东大桥','重庆公司','亳阜高速','京台高速','岑兴兴梧','富帆高速']
  const chartData = data || { profit: [100,140,230,100,130,120,120,125,180,160,100,110], income: [150,160,200,140,170,120,130,200,220,130,110,190], cost: [180,195,160,210,185,150,160,220,225,130,125,170] }
  const scale = period === '年累计' ? 1.18 : 1
  const compact = names.length <= 4
  const barWidth = compact ? 14 : 8
  const option = { animationDuration: 500, grid: { left: 34, right: 8, top: 38, bottom: compact ? 72 : 88 }, dataZoom: compact ? [] : dataZoom, legend: { top: 'auto', bottom: 4, left: 'center', itemWidth: 14, itemHeight: 10, itemGap: 12, textStyle: { color: colors.text, fontSize: 12 }, data: ['利润','收入','成本'] }, tooltip: { ...tooltip, axisPointer: { type: 'shadow' } }, xAxis: { type: 'category', data: names, boundaryGap: true, axisLine: { lineStyle: { color: colors.grid } }, axisTick: { show: false }, axisLabel: { color: colors.tertiary, fontSize: 12, rotate: compact ? 30 : 32, interval: 0 } }, yAxis: { ...commonY, min: 0 }, series: [{ name: '利润', type: 'bar', barWidth, barGap: '20%', barCategoryGap: compact ? '32%' : '20%', itemStyle: { color: colors.primary, borderRadius: [2,2,0,0] }, data: chartData.profit.map(value => value * scale) }, { name: '收入', type: 'bar', barWidth, itemStyle: { color: colors.teal, borderRadius: [2,2,0,0] }, data: chartData.income.map(value => value * scale) }, { name: '成本', type: 'bar', barWidth, itemStyle: { color: colors.orange, borderRadius: [2,2,0,0] }, data: chartData.cost.map(value => value * scale) }] }
  const axis = dynamicAxis([...chartData.profit, ...chartData.income, ...chartData.cost].map(value => value * scale), 50)
  option.yAxis.max = axis.max; option.yAxis.interval = axis.interval
  option.series.forEach(series => { series.barWidth = dynamicBarWidth(names.length, option.series.length, compact ? 170 : 190); series.itemStyle = { ...series.itemStyle, borderRadius: [3, 3, 0, 0] } })
  return <Chart option={option} height={335} />
}
export const ECompanyBars = memo(ECompanyBarsView)

function RevenueAnalysisBars({ title, names, series, unit = '万元', stacked = false, headerRight }) {
  const axis = dynamicAxis(series.flatMap(item => item.data), 50)
  const interval = axis.interval
  const axisMax = axis.max
  const compactWidth = dynamicBarWidth(names.length, series.length)
  const needsScroll = names.length > 6
  if (stacked) series = series.map(item => ({ ...item, color: item.name === '客车流量(去年)' ? '#B8B8B8' : item.name === '货车流量(去年)' ? '#D9D9D9' : item.color }))
  const option = { animationDuration: 400, grid: { left: 38, right: 8, top: 52, bottom: 96 }, dataZoom: needsScroll ? [{ type: 'inside', xAxisIndex: 0, filterMode: 'none', start: 0, end: 62, zoomOnMouseWheel: false, moveOnMouseMove: true, moveOnMouseWheel: true }] : [], legend: { bottom: 4, left: 'center', itemWidth: 14, itemHeight: 10, itemGap: 12, textStyle: { color: colors.text, fontSize: 11 }, data: series.map(item => item.name) }, tooltip: { ...tooltip, axisPointer: { type: 'shadow' }, valueFormatter: value => `${formatChartNumber(value)} ${unit}` }, xAxis: { type: 'category', data: names, axisLine: { lineStyle: { color: colors.grid } }, axisTick: { show: false }, axisLabel: { color: colors.tertiary, fontSize: 10, rotate: 30, interval: 0 } }, yAxis: { ...commonY, min: 0, max: axisMax, interval, name: unit }, series: series.map((item, index) => ({ name: item.name, stack: stacked ? (item.name.includes('去年') ? 'previous' : 'current') : undefined, type: 'bar', barWidth: compactWidth, barGap: '0%', barCategoryGap: stacked ? '38%' : (series.length > 2 ? '18%' : '28%'), itemStyle: { color: item.color === '#4E86EA' ? colors.primary : item.color || (index ? '#B8B8B8' : colors.primary), borderRadius: stacked && !item.name.includes('货车') ? [0,0,0,0] : [2,2,0,0] }, data: item.data })) }
  return <section className="revenue-detail-chart"><div className="revenue-detail-chart-heading"><h2>{title}</h2>{headerRight}</div><Chart option={option} height={300} /></section>
}

const sameRevenueChart = (prev, next) => prev.title === next.title && prev.unit === next.unit && prev.stacked === next.stacked && prev.headerRight === next.headerRight && prev.names.join('|') === next.names.join('|') && prev.series.length === next.series.length && prev.series.every((item, index) => {
  const nextItem = next.series[index]
  return item.name === nextItem.name && item.color === nextItem.color && item.data.join(',') === nextItem.data.join(',')
})

export const ERevenueAnalysisBars = memo(RevenueAnalysisBars, sameRevenueChart)

function ECostCompanyBarsView({ period = '当月' } = {}) {
  const names = ['甬台温高速','宁波交通科技','九龙高速','桂林公司','京津塘高速','贵黄高速','鄂东大桥','重庆公司','亳阜高速']
  const scale = period === '年累计' ? 1.18 : 1
  const option = { animationDuration: 450, grid: { left: 42, right: 8, top: 42, bottom: 116 }, dataZoom: [{ type: 'inside', xAxisIndex: 0, filterMode: 'none', start: 0, end: 68, zoomOnMouseWheel: false, moveOnMouseMove: true, moveOnMouseWheel: true }], tooltip: { ...tooltip, axisPointer: { type: 'shadow' }, formatter: params => { const list = Array.isArray(params) ? params : [params]; return [list[0]?.axisValueLabel || '', ...list.map(item => `${item.marker}${item.seriesName}: ${formatChartNumber(item.value)} 万元`)].join('<br/>') } }, legend: { bottom: 4, left: 'center', itemWidth: 14, itemHeight: 10, itemGap: 28, textStyle: { color: colors.text, fontSize: 12 }, data: ['经营成本','经营成本(去年)'] }, xAxis: { type: 'category', data: names, boundaryGap: true, axisLine: { lineStyle: { color: '#73777f' } }, axisTick: { show: true }, axisLabel: { color: colors.text, fontSize: 11, rotate: 32, interval: 0 } }, yAxis: { ...commonY, min: 0, max: 250, interval: 50, name: '万元' }, series: [{ name: '经营成本', type: 'bar', barWidth: 16, barGap: '0%', barCategoryGap: '42%', itemStyle: { color: '#036CFF', borderRadius: [1,1,0,0] }, data: [100,140,230,100,130,120,180,170,160].map(value => value * scale) }, { name: '经营成本(去年)', type: 'bar', barWidth: 16, barGap: '0%', itemStyle: { color: '#B8B8B8', borderRadius: [1,1,0,0] }, data: [150,100,200,140,100,142,120,126,130].map(value => value * scale) }] }
  const axis = dynamicAxis([...option.series[0].data, ...option.series[1].data], 50)
  option.yAxis.max = axis.max; option.yAxis.interval = axis.interval
  option.series.forEach(series => { series.barWidth = dynamicBarWidth(names.length, option.series.length); series.itemStyle = { ...series.itemStyle, borderRadius: [3, 3, 0, 0] } })
  return <Chart option={option} height={360} />
}
export const ECostCompanyBars = memo(ECostCompanyBarsView)

function ECostCompositionBarsView() {
  const names = ['甬台温高速','宁波交通科技','九龙高速','桂林公司','京津塘高速','贵黄高速','鄂东大桥','重庆公司','亳阜高速']
  const option = { grid: { left: 42, right: 8, top: 12, bottom: 118 }, dataZoom: [{ type: 'inside', xAxisIndex: 0, filterMode: 'none', start: 0, end: 72, zoomOnMouseWheel: false, moveOnMouseMove: true, moveOnMouseWheel: true }], legend: { bottom: 4, left: 'center', itemWidth: 14, itemHeight: 10, itemGap: 8, textStyle: { color: colors.text, fontSize: 11 }, data: ['道路养护费用','系统维护费用','折旧与摊销','其他业务成本'] }, tooltip: { ...tooltip, axisPointer: { type: 'shadow' } }, xAxis: { type: 'category', data: names, axisLine: { lineStyle: { color: '#73777f' } }, axisTick: { show: true }, axisLabel: { color: colors.text, fontSize: 11, rotate: 32, interval: 0 } }, yAxis: { type: 'value', min: 0, max: 1000, interval: 200, name: '万元', nameLocation: 'end', axisLabel: { color: colors.tertiary, fontSize: 11, formatter: formatAxisNumber }, splitLine: { lineStyle: { color: '#bfc1c4' } } }, series: [{ name: '道路养护费用', type: 'bar', stack: 'cost', barWidth: 24, itemStyle: { color: '#036CFF' }, data: [150,100,200,140,100,140,120,120,130] }, { name: '系统维护费用', type: 'bar', stack: 'cost', barWidth: 24, itemStyle: { color: '#0FDBAA' }, data: [160,180,140,180,170,130,180,230,210] }, { name: '折旧与摊销', type: 'bar', stack: 'cost', barWidth: 24, itemStyle: { color: '#FAC905' }, data: [120,130,160,220,100,190,180,210,220] }, { name: '其他业务成本', type: 'bar', stack: 'cost', barWidth: 24, itemStyle: { color: '#FFA174' }, data: [150,160,130,120,130,140,230,170,180] }] }
  option.grid.left = 48
  option.grid.top = 52
  option.yAxis.name = '万元'
  option.yAxis.nameLocation = 'end'
  option.yAxis.nameRotate = 0
  option.yAxis.nameGap = 12
  option.yAxis.nameTextStyle = { color: colors.tertiary, fontSize: 11, align: 'right', padding: [0, 0, 6, 0] }
  option.yAxis.splitLine = { lineStyle: { color: colors.grid, type: 'dashed' } }
  option.series.forEach((series, index) => { series.itemStyle = { ...series.itemStyle, borderRadius: index === option.series.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0] } })
  const stackedTotals = names.map((_, index) => option.series.reduce((total, series) => total + Number(series.data[index] || 0), 0))
  const axis = dynamicAxis(stackedTotals, 100)
  option.yAxis.max = axis.max; option.yAxis.interval = axis.interval
  option.series.forEach((series, index) => { series.barWidth = dynamicBarWidth(names.length, 1, 250); series.itemStyle = { ...series.itemStyle, borderRadius: index === option.series.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0] } })
  return <Chart option={option} height={390} />
}
export const ECostCompositionBars = memo(ECostCompositionBarsView)

export const ECostDetailBars = memo(function ECostDetailBars({ category = '道路养护费用' } = {}) {
  const categoryData = {
    道路养护费用: { names: ['日常养护','专项养护','抢险养护','路损养护','预提养护费用','其他'], current: [100,140,230,100,130,120], previous: [150,100,200,140,100,142], color: '#036CFF' },
    系统维护费用: { names: ['系统维护','设备维护','软件服务','网络维护'], current: [120,160,210,145], previous: [135,125,190,130], color: '#0FDBAA' },
    折旧与摊销: { names: ['固定资产折旧','无形资产摊销','长期待摊费用'], current: [180,130,95], previous: [160,145,80], color: '#FAC905' },
    其他业务成本: { names: ['办公费用','差旅费用','业务招待费','其他'], current: [110,145,90,130], previous: [125,120,105,115], color: '#FFA174' }
  }
  const selected = categoryData[category] || categoryData.道路养护费用
  const option = { grid: { left: 42, right: 8, top: 42, bottom: 92 }, legend: { bottom: 4, left: 'center', itemWidth: 14, itemHeight: 10, itemGap: 28, textStyle: { color: colors.text, fontSize: 12 }, data: ['当期','去年同期'] }, tooltip: { ...tooltip, axisPointer: { type: 'shadow' } }, xAxis: { type: 'category', data: selected.names, axisLine: { lineStyle: { color: '#73777f' } }, axisTick: { show: true }, axisLabel: { color: colors.text, fontSize: 11, rotate: 32, interval: 0 } }, yAxis: { ...commonY, min: 0, max: 250, interval: 50, name: '万元' }, series: [{ name: '当期', type: 'bar', barWidth: 16, barGap: '0%', barCategoryGap: '42%', itemStyle: { color: selected.color, borderRadius: [3,3,0,0] }, data: selected.current }, { name: '去年同期', type: 'bar', barWidth: 16, barGap: '0%', itemStyle: { color: '#B8B8B8', borderRadius: [3,3,0,0] }, data: selected.previous }] }
  const axis = dynamicAxis([...selected.current, ...selected.previous], 50)
  option.yAxis.max = axis.max; option.yAxis.interval = axis.interval
  option.series.forEach(series => { series.barWidth = dynamicBarWidth(selected.names.length, option.series.length); series.itemStyle = { ...series.itemStyle, borderRadius: [3, 3, 0, 0] } })
  return <Chart option={option} height={390} />
})
