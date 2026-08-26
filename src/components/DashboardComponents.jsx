import React, { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Picker from 'react-mobile-picker'
import { Popup } from 'antd-mobile'
import { formatMetricValue } from '../utils/formatters'
import { ECostCompanyBars, ECostCompositionBars, ECostDetailBars, ECostTrend, EProfitTrend, ERevenueAnalysisBars, ERevenueTrend } from '../charts'
function ECompanyBars({ composition = false, period }) {
  return composition ? <ECostCompositionBars /> : <ECostCompanyBars period={period} />
}

export function FilterBar({ organization, organizationOpen, onOrganizationOpen, month, timeOpen, onTimeOpen }) {
  return <div className="filters"><button type="button" aria-haspopup="dialog" aria-expanded={organizationOpen} onClick={onOrganizationOpen}>{organization}<ChevronDown size={15}/></button><button type="button" aria-haspopup="dialog" aria-expanded={timeOpen} onClick={onTimeOpen}>{month.year}年{month.month}月<ChevronDown size={15}/></button></div>
}

export function RouteStatusBar() {
  return <div className="route-status-bar" aria-label="手机状态栏"><img className="route-status-time" src="/ZSRoad_mobile/assets/figma-route-time.svg" alt="12:00" /><div className="route-status-icons"><img className="route-status-mobile" src="/ZSRoad_mobile/assets/figma-route-mobile-signal.svg" alt="" /><img className="route-status-wifi" src="/ZSRoad_mobile/assets/figma-route-wifi.svg" alt="" /><span className="route-status-battery"><img src="/ZSRoad_mobile/assets/figma-route-battery-outline.svg" alt="" /><img src="/ZSRoad_mobile/assets/figma-route-battery.svg" alt="" /></span></div></div>
}

export function OrganizationPopup({ visible, value, options, onChange, onClose }) {
  return <Popup visible={visible} position="bottom" bodyClassName="organization-popup-body" onMaskClick={onClose} onClose={onClose}>
    <section className="organization-sheet" role="dialog" aria-label="组织选择">
      <div className="organization-sheet-header"><h2>组织</h2><button type="button" aria-label="关闭组织选择" onClick={onClose}><img src="/ZSRoad_mobile/assets/figma-organization-close.svg" alt="" /></button></div>
      <div className="organization-list">{options.map(name => <button type="button" className="organization-option" key={name} onClick={() => { onChange(name); onClose() }}><span>{name}</span>{value === name && <img src="/ZSRoad_mobile/assets/figma-organization-selected.svg" alt="" />}</button>)}</div>
    </section>
  </Popup>
}

export function FactorPopup({ visible, value, options, onChange, onClose }) {
  return <Popup visible={visible} position="bottom" bodyClassName="organization-popup-body" onMaskClick={onClose} onClose={onClose}>
    <section className="organization-sheet factor-sheet" role="dialog" aria-label="影响因素选择">
      <div className="organization-sheet-header"><h2>影响因素</h2><button type="button" aria-label="关闭影响因素选择" onClick={onClose}><img src="/ZSRoad_mobile/assets/figma-organization-close.svg" alt="" /></button></div>
      <div className="organization-list">{options.map(name => <button type="button" className="organization-option" key={name} onClick={() => { onChange(name); onClose() }}><span>{name}</span>{value === name && <img src="/ZSRoad_mobile/assets/figma-organization-selected.svg" alt="" />}</button>)}</div>
    </section>
  </Popup>
}

export function MonthPickerPopup({ visible, draft, years, visibleMonths, onChange, onConfirm, onClose }) {
  return visible && <div className="time-backdrop" role="presentation" onClick={onClose}>
    <section className="time-sheet" role="dialog" aria-modal="true" aria-label="选择月份" onClick={event => event.stopPropagation()}>
      <div className="time-picker-toolbar"><button type="button" className="time-cancel" onClick={onClose}>取消</button><h2>选择月份</h2><button type="button" className="time-confirm" onClick={onConfirm}>确定</button></div>
      <div className="time-picker-content"><Picker className="time-wheel-picker" height={264} itemHeight={44} value={{ year: String(draft.year), month: String(draft.month) }} onChange={onChange}>
        <Picker.Column name="year">{years.map(year => <Picker.Item key={year} value={String(year)}>{({ selected }) => <span className={selected ? 'time-wheel-item selected' : 'time-wheel-item'}>{year}</span>}</Picker.Item>)}</Picker.Column>
        <Picker.Column name="month">{visibleMonths.map(month => <Picker.Item key={month} value={String(month)}>{({ selected }) => <span className={selected ? 'time-wheel-item selected' : 'time-wheel-item'}>{month}</span>}</Picker.Item>)}</Picker.Column>
      </Picker></div>
      <div className="home-indicator"/>
    </section>
  </div>
}

const rankIcons = [
  '/ZSRoad_mobile/assets/figma-rank-first.svg',
  '/ZSRoad_mobile/assets/figma-rank-second.svg',
  '/ZSRoad_mobile/assets/figma-rank-third.svg'
]

export function RankingTable({ rows, sort, onSort, period, onPeriodChange, formatNumber, title = '各公司利润排名', valueLabel, showPeriod, detailColumns }) {
  const isCostRanking = title === '各项目公司经营成本排名'
  const resolvedValueLabel = valueLabel || (isCostRanking ? '经营成本' : '利润')
  const resolvedShowPeriod = showPeriod ?? !isCostRanking
  const detailMode = detailColumns && Array.isArray(detailColumns.headers)
  return <section className={`ranking ${detailMode ? 'ranking-detail' : ''}`}><Heading title={title} unit={false}>{resolvedShowPeriod && <div className="switch ranking-period-switch"><button type="button" className={period === '月' ? 'on' : ''} onClick={() => onPeriodChange('月')}>当月</button><button type="button" className={period === '年' ? 'on' : ''} onClick={() => onPeriodChange('年')}>年累计</button></div>}</Heading><div className="table"><div className="table-head"><span>排名</span><span>单位名称</span>{detailMode ? detailColumns.headers.map((label, index) => <button type="button" className="sort-header" aria-sort="none" key={`${label}-${index}`}>{label}<SortIcon active={false} direction="desc"/></button>) : [['profit',resolvedValueLabel],['yoy','同比'],['mom','环比']].map(([key,label]) => <button type="button" className={`sort-header ${sort.key === key ? 'active' : ''}`} aria-sort={sort.key === key ? sort.direction : 'none'} onClick={() => onSort(key)} key={key}>{label}<SortIcon active={sort.key === key} direction={sort.direction}/></button>)}<span>状态</span></div>{rows.map(([name, profit, yoy, mom, status], index) => <div className="table-row" key={name}><span className={`rank rank-${index + 1}`}>{index < 3 ? <><img src={rankIcons[index]} alt="" /><b className="rank-number">{index + 1}</b></> : index + 1}</span><a href="#" onClick={event => event.preventDefault()}>{name}</a>{detailMode ? (detailColumns.rows[index] || []).map((value, columnIndex) => <span key={columnIndex} className={String(value).startsWith('+') ? 'red' : String(value).startsWith('-') ? 'green' : ''}>{value}</span>) : <><span>{formatNumber(profit)}</span><ChangeValue value={yoy}/><ChangeValue value={mom}/></>}<b className={`status ${status}`}>{status}</b></div>)}</div></section>
}

const segmentRows = [
  ['阳平高速', '桂林公司', '181.10', '-4.32%', '+2.35%'],
  ['桂阳高速', '桂林公司', '181.10', '+2.35%', '-4.32%'],
  ['桂兴高速', '桂林公司', '181.10', '-4.32%', '+2.35%'],
  ['灵三高速', '桂林公司', '181.10', '+2.35%', '-4.32%'],
  ['象山港大桥', '甬台温高速', '181.10', '-4.32%', '+2.35%'],
  ['乐清湾大桥', '甬台温高速', '181.10', '+2.35%', '-4.32%']
]

export function SegmentPage({ period, onPeriodChange, sort, onSort, formatNumber }) {
  return <section className="segment-page"><div className="segment-toolbar"><div className="switch"><button className={period === '月' ? 'on' : ''} onClick={() => onPeriodChange('月')}>月</button><button className={period === '年' ? 'on' : ''} onClick={() => onPeriodChange('年')}>年</button></div><div className="segment-meta"><span>单位：<b>万元</b></span><span className="updated">数据更新时间：2026-04-01</span></div></div><div className="table segment-table"><div className="table-head"><span>排名</span><span>路段</span><span>项目公司</span><button type="button" className={`sort-header ${sort.key === 'profit' ? 'active' : ''}`} onClick={() => onSort('profit')}>通行费收入<SortIcon active={sort.key === 'profit'} direction={sort.direction}/></button><button type="button" className={`sort-header ${sort.key === 'yoy' ? 'active' : ''}`} onClick={() => onSort('yoy')}>同比<SortIcon active={sort.key === 'yoy'} direction={sort.direction}/></button><button type="button" className={`sort-header ${sort.key === 'mom' ? 'active' : ''}`} onClick={() => onSort('mom')}>环比<SortIcon active={sort.key === 'mom'} direction={sort.direction}/></button></div><div className="table-row segment-total"><span></span><span>合计</span><span></span><span>181.10</span><ChangeValue value="+2.35%"/><ChangeValue value="-4.32%"/></div>{segmentRows.map(([road, company, income, yoy, mom], index) => <div className="table-row" key={road}><span className={`rank rank-${index + 1}`}>{index < 3 ? <><img src={rankIcons[index]} alt="" /><b className="rank-number">{index + 1}</b></> : index + 1}</span><a>{road}</a><span className="segment-company">{company}</span><span>{formatNumber(income)}</span><ChangeValue value={yoy}/><ChangeValue value={mom}/></div>)}</div></section>
}

export function Heading({ title, unit = true, meta, children }) {
  return <div className="heading"><div className="heading-main"><h2>{title}</h2>{children}</div><div className="heading-meta">{unit && <span>单位：<b>万元</b></span>}{meta}</div></div>
}

function ChangeValue({ value }) {
  const text = String(value ?? '-')
  if (text.trim() === '-') return <span>{text}</span>
  const rising = text.trim().startsWith('+')
  const falling = text.trim().startsWith('-')
  return <span className={rising ? 'red' : falling ? 'green' : ''}>{text}{rising && <i className="change-arrow" aria-hidden="true">▲</i>}{falling && <i className="change-arrow" aria-hidden="true">▼</i>}</span>
}

export function MetricCard({ title, value, suffix = '', change, drilldown = false, onDrilldown }) {
  return <div className="metric-card"><div className="metric-label">{title}{drilldown && <button type="button" className="metric-drilldown" aria-label={`${title}详情`} onClick={onDrilldown}><ChevronRight className="drilldown-icon" aria-hidden="true" size={18}/></button>}</div><strong>{formatMetricValue(title, value)}<small>{title === '净利率' ? '' : suffix}</small></strong><p>同比：<ChangeValue value={change}/></p></div>
}

function formatRevenueCenter(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return { value: '-', unit: '万元' }
  if (Math.abs(amount) >= 10000) return { value: (amount / 10000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), unit: '亿元' }
  return { value: amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), unit: '万元' }
}

export function RevenuePage({ rows, sort, onSort, period, onPeriodChange, formatNumber, rankingTitle = '各公司通行费收入排名', onMoreAnalysis, isProjectCompany = false }) {
  const months = Array.from({ length: 12 }, (_, index) => index + 1)
  const currentMonth = new Date().getMonth() + 1
  const revenueCenter = formatRevenueCenter(2460.91)
  const [trendPeriod, setTrendPeriod] = useState('月')
  return <div className={`revenue-page `}><div className="revenue-meta"><span>单位：<b>万元</b></span><span>数据更新时间：<em>2026-04-01</em></span></div><section className="revenue-section"><Heading title="通行费收入" unit={false}><div className="switch ranking-period-switch"><button type="button" className={period === '月' ? 'on' : ''} onClick={() => onPeriodChange('月')}>当月</button><button type="button" className={period === '年' ? 'on' : ''} onClick={() => onPeriodChange('年')}>年累计</button></div></Heading><div className="revenue-summary"><div className="donut donut-blue"><strong>{revenueCenter.value}<small>{revenueCenter.unit}</small></strong><em>+102.81 ▲</em></div><div className="revenue-legend"><p><i className="dot blue"/><span>ETC</span><b>1,260.91</b><small>万元</small><em className="red"><span className="change-label">同比：</span>+102.81 ▲</em></p><p><i className="dot teal"/><span>MTC</span><b>1,200.00</b><small>万元</small><em className="green"><span className="change-label">同比：</span>-6.54 ▼</em></p></div></div><div className="revenue-cards"><div><span>绿通车免费金额</span><b>328.19</b><small>万元</small><p>同比：<em className="red">+14.98 ▲</em></p></div><div><span>绿通车免费金额占比</span><b>4</b><small>%</small><p>同比：<em className="red">+0.32bps ▲</em></p></div></div></section><section className="revenue-section"><Heading title="折算全程混合车流量" unit={false}/><div className="revenue-summary warm"><div className="donut donut-orange"><strong>2,460.91<small>万辆</small></strong><em className="green">-23.87 ▼</em></div><div className="revenue-legend"><p><i className="dot orange"/><span>客车</span><b>1,260.91</b><small>万辆</small><em className="red"><span className="change-label">同比：</span>+34.98 ▲</em></p><p><i className="dot amber"/><span>货车</span><b>1,200.00</b><small>万辆</small><em className="green"><span className="change-label">同比：</span>-123.87 ▼</em></p></div></div><button type="button" className="revenue-more" onClick={onMoreAnalysis}>查看更多分析 »</button></section><section className="revenue-section revenue-trend"><Heading title="通行费收入趋势" unit={false}><div className="switch ranking-period-switch"><button type="button" className={trendPeriod === '月' ? 'on' : ''} onClick={() => setTrendPeriod('月')}>当月</button><button type="button" className={trendPeriod === '年' ? 'on' : ''} onClick={() => setTrendPeriod('年')}>年累计</button></div></Heading><ERevenueTrend period={trendPeriod === '年' ? '年累计' : '当月'}/></section><section className="factors"><Heading title="影响因素" unit={false}/><div className="factor-table"><div className="factor-head"><span>影响因素</span>{months.map(month => <span key={month}>{month}月</span>)}</div>{['异常天气(天)','交通管制(小时)','交通事件(小时)','养护事故(小时)','非特殊日期','法定节假日','节假日过渡'].map((name, index) => <div className="factor-row" key={name}><a>{name}</a>{months.map(month => <span key={month}>{month <= currentMonth ? (index % 3 === 0 ? 2 : index % 3 === 1 ? 3 : 1) : '-'}</span>)}</div>)}</div><small className="factor-hint">← 左右滑动查看完整内容</small></section><RankingTable rows={rows} title={rankingTitle} valueLabel="通行费收入" sort={sort} onSort={onSort} period={period} onPeriodChange={onPeriodChange} formatNumber={formatNumber}/></div>
}

export function RevenueDetailPage({ rows, sort, onSort, period, onPeriodChange, formatNumber }) {
  const names = ['甬台温高速','宁波交通科技','九龙高速','桂林公司','京津塘高速','贵黄公司','鄂东大桥','重庆公司','亳阜高速']
  const factorNames = ['异常天气','交通管制','交通事件','养护事件','非特殊日期','法定节假日','节假日过渡']
  const [factorIndex, setFactorIndex] = useState(0)
  const [factorOpen, setFactorOpen] = useState(false)
  const factorName = factorNames[factorIndex]
  const factorSelector = useMemo(() => <div className="factor-category-switch"><button type="button" aria-label="上一个影响因素" onClick={() => setFactorIndex(index => (index - 1 + factorNames.length) % factorNames.length)}>◀</button><button type="button" className="factor-category-label" onClick={() => setFactorOpen(true)}>{factorName}</button><button type="button" aria-label="下一个影响因素" onClick={() => setFactorIndex(index => (index + 1) % factorNames.length)}>▶</button></div>, [factorName])
  const factorSeries = [{ name: `${factorName}(天)`, data: [100,140,230,100,130,120,180,170,160], color: '#036CFF' }, { name: `${factorName}(去年)`, data: [150,100,200,140,100,142,120,126,130], color: '#B8B8B8' }]
  const detailHeaders = ['单位名称','通行费收入','同比','客车流量','同比','货车流量','同比','异常天气天数','同比','交通管制小时数','同比','交通事件小时数','同比','养护事件小时数','同比','非特殊日期天数','同比','法定节假日天数','同比','节假日过渡天数','同比']
  const detailRows = rows.map(([name], index) => [name, '181.10', index % 2 ? '-4.32%' : '+32.35%', '181.10', index % 2 ? '-4.32%' : '+32.35%', '181.10', index % 2 ? '-4.32%' : '+32.35%', '2', index % 2 ? '-4.32%' : '+32.35%', '3', index % 2 ? '-4.32%' : '+32.35%', '1', index % 2 ? '-4.32%' : '+32.35%', '2', index % 2 ? '-4.32%' : '+32.35%', '5', index % 2 ? '-4.32%' : '+32.35%', '3', index % 2 ? '-4.32%' : '+32.35%', '2', index % 2 ? '-4.32%' : '+32.35%'])
  detailRows.forEach((row, index) => { const n = index + 1; row[1] = (120 + n * 13).toFixed(2); row[3] = (90 + (n % 6) * 28).toFixed(2); row[5] = (150 + (n % 5) * 34).toFixed(2); row[7] = String((n * 3) % 11 + 1); row[9] = String((n * 5) % 9 + 1); row[11] = String((n * 2) % 8 + 1); row[13] = String((n * 4) % 10 + 1); row[15] = String((n * 3) % 7 + 1); row[17] = String((n * 5) % 12 + 1); row[19] = String((n * 2) % 9 + 1) })
  const [detailSort, setDetailSort] = useState({ index: 1, direction: "desc" })
  const sortedDetailRows = [...detailRows].sort((a, b) => { const key = detailSort.index; if (key < 0) return 0; const av = parseFloat(String(a[key]).replace(/[^0-9.+-]/g, "")); const bv = parseFloat(String(b[key]).replace(/[^0-9.+-]/g, "")); if (Number.isNaN(av) || Number.isNaN(bv)) return 0; return detailSort.direction === "asc" ? av - bv : bv - av })
  return <div className="revenue-detail-page"><FactorPopup visible={factorOpen} value={factorName} options={factorNames} onChange={name => setFactorIndex(factorNames.indexOf(name))} onClose={() => setFactorOpen(false)}/><div className="revenue-meta"><span>数据更新时间：<em>2026-04-01</em></span><span>单位：<b>万元</b></span><div className="switch"><button className={period === '月' ? 'on' : ''} onClick={() => onPeriodChange('月')}>月</button><button className={period === '年' ? 'on' : ''} onClick={() => onPeriodChange('年')}>年</button></div></div><ERevenueAnalysisBars title="各公司通行费收入" names={names} series={[{ name: '通行费收入', data: [100,140,230,100,130,120,180,170,160], color: '#4E86EA' }, { name: '通行费收入(去年)', data: [150,100,200,140,100,142,120,126,130], color: '#B8B8B8' }]}/><ERevenueAnalysisBars title="各公司折算全程混合车流量" names={names} unit="万辆" stacked series={[{ name: '客车流量', data: [100,140,230,100,130,120,180,170,160], color: '#B179F1' }, { name: '客车流量(去年)', data: [150,100,200,140,100,142,120,126,130], color: '#C9C9C9' }, { name: '货车流量', data: [250,240,430,240,300,260,300,295,290], color: '#61B8C0' }, { name: '货车流量(去年)', data: [310,295,530,300,280,325,375,365,370], color: '#C9C9C9' }]}/><ERevenueAnalysisBars title="影响因素" headerRight={factorSelector} names={names} series={factorSeries}/><section className="revenue-detail-ranking"><Heading title="各公司数据明细" unit={false}/><div className="revenue-detail-table"><div className="revenue-detail-table-head">{detailHeaders.map((header, index) => <button type="button" key={index} onClick={() => index > 0 && setDetailSort(current => ({ index, direction: current.index === index && current.direction === "desc" ? "asc" : "desc" }))}>{header}{index > 0 && <i className={"detail-sort-mark " + (detailSort.index === index ? "active-" + detailSort.direction : "")}>◆</i>}</button>)}</div>{sortedDetailRows.map(row => <div className="revenue-detail-table-row" key={row[0]}>{row.map((value, index) => index === 0 ? <a key={index}>{value}</a> : <span key={index} className={String(value).startsWith('+') ? 'red' : String(value).startsWith('-') ? 'green' : ''}>{value}</span>)}</div>)}</div></section></div>
}

export function CostPage({ rows, sort, onSort, period, onPeriodChange, formatNumber, isProjectCompany = false }) {
  const costItems = [['道路养护费用', '98,754.22', '22.47%', '-4.13%'], ['系统维护费用', '87,356.81', '19.88%', '+1.22%'], ['折旧与摊销', '63,981.25', '14.56%', '-4.13%'], ['其他业务成本', '53,496.91', '12.17%', '+1.22%']]
  const maintenanceItems = [['日常养护', '32,110.00', '32.52%', '+1.23%'], ['专项养护', '24,580.00', '24.88%', '-2.54%'], ['抢险养护', '16,240.00', '16.44%', '+1.23%'], ['路损养护', '11,680.00', '11.83%', '-2.54%'], ['预提养护费用', '8,920.00', '9.03%', '+1.23%'], ['其他', '5,224.22', '5.29%', '-2.54%']]
  const [selectedCost, setSelectedCost] = useState(null)
  const detailCategories = ['道路养护费用', '系统维护费用', '折旧与摊销', '其他业务成本']
  const [detailCategoryIndex, setDetailCategoryIndex] = useState(0)
  const detailCategory = detailCategories[detailCategoryIndex]
  const detailSubItems = {
    人工成本: [['工资', '321.00', '32.16%', '-2.54%'], ['五险一金', '321.00', '32.16%', '+1.23%'], ['福利', '321.00', '32.16%', '-2.54%'], ['职工教育经费', '321.00', '32.16%', '+1.23%'], ['工会经费', '321.00', '32.16%', '-2.54%'], ['商业保险', '321.00', '32.16%', '+1.23%'], ['劳动保护费', '321.00', '32.16%', '-2.54%'], ['其他人工成本', '321.00', '32.16%', '+1.23%']],
    道路养护费用: maintenanceItems,
    系统维护费用: [['系统维护', '120.00', '28.57%', '+1.23%'], ['设备维护', '160.00', '38.10%', '-2.54%'], ['软件服务', '210.00', '50.00%', '+1.23%'], ['网络维护', '145.00', '34.52%', '-2.54%']],
    折旧与摊销: [['固定资产折旧', '180.00', '44.44%', '+1.23%'], ['无形资产摊销', '130.00', '32.10%', '-2.54%'], ['长期待摊费用', '95.00', '23.46%', '+1.23%']],
    其他业务成本: [['办公费用', '110.00', '23.16%', '+1.23%'], ['差旅费用', '145.00', '30.53%', '-2.54%'], ['业务招待费', '90.00', '18.95%', '+1.23%'], ['其他', '130.00', '27.37%', '-2.54%']]
  }
  const [expandedDetails, setExpandedDetails] = useState({})
  const toggleDetail = name => setExpandedDetails(current => ({ ...current, [name]: !current[name] }))
  const compositionItems = selectedCost === '道路养护费用' ? maintenanceItems : costItems
  const compositionTotal = selectedCost === '道路养护费用' ? '98,754.22' : '307,548.28'
  const donutColors = ['#036CFF', '#0FDBAA', '#55A965', '#FAC905', '#FFA174', '#F56C7D']
  const donutTotal = compositionItems.reduce((sum, item) => sum + Number(String(item[1]).replace(/,/g, '')), 0)
  let donutCursor = 0
  const donutStops = compositionItems.map((item, index) => { const start = donutCursor; donutCursor += Number(String(item[1]).replace(/,/g, '')) / donutTotal * 360; return `${donutColors[index % donutColors.length]} ${start}deg ${donutCursor}deg` }).join(', ')
  const donutStyle = { background: `conic-gradient(${donutStops})` }
  const detailPrimaryItems = [['人工成本', '2,568.00', '32.16%', '+1.23%'], ...costItems]
  const trendSection = <section className="cost-section"><Heading title="成本趋势" unit={false}/><ECostTrend period={period === '年' ? '年累计' : '当月'}/></section>
  return <div className={`cost-page `}><div className="cost-meta"><span>单位：<b>万元</b></span><span>数据更新时间：<em>2026-04-01</em></span><div className="switch cost-period-switch"><button type="button" className={period === '月' ? 'on' : ''} onClick={() => onPeriodChange('月')}>当月</button><button type="button" className={period === '年' ? 'on' : ''} onClick={() => onPeriodChange('年')}>年累计</button></div></div>{trendSection}<section className={`cost-section cost-composition-section ${selectedCost ? 'is-detail' : ''}`}><Heading title="经营成本构成" unit={false}>{selectedCost && <button type="button" className="cost-composition-back" onClick={() => setSelectedCost(null)}>‹ 返回</button>}</Heading><div className="cost-composition"><div className="cost-donut" style={donutStyle}><strong>{compositionTotal}<small>万元</small></strong></div><div className="cost-legend"><div className="cost-legend-head"><span>科目</span><span>成本金额</span><span>占比</span><span>同比</span></div>{compositionItems.map(([name, value, ratio, yoy], index) => <button type="button" className="cost-legend-row" key={name} onClick={() => !selectedCost && name === '道路养护费用' && setSelectedCost(name)}><i className={`cost-dot cost-dot-${index + 1}`}/><span>{name}</span><b>{value}</b><small>{ratio}</small><ChangeValue value={yoy}/></button>)}</div></div></section><section className="cost-section"><Heading title="项目公司成本对比" unit={false}/><ECompanyBars period={period === '年' ? '年累计' : '当月'}/></section><section className="cost-section"><Heading title="项目公司成本构成分析" unit={false}/><ECompanyBars composition period={period === '年' ? '年累计' : '当月'}/></section><section className="cost-section cost-detail-section"><Heading title="成本构成明细" unit={false}><div className="cost-detail-category-switch"><button type="button" aria-label="上一个科目" disabled={detailCategoryIndex === 0} onClick={() => setDetailCategoryIndex(index => Math.max(0, index - 1))}>◀</button><span>{detailCategory}</span><button type="button" aria-label="下一个科目" disabled={detailCategoryIndex === detailCategories.length - 1} onClick={() => setDetailCategoryIndex(index => Math.min(detailCategories.length - 1, index + 1))}>▶</button></div></Heading><ECostDetailBars category={detailCategory}/><div className="cost-detail-table"><div className="cost-detail-head"><span>科目</span><span>成本金额</span><span>占比</span><span>同比</span></div>{detailPrimaryItems.map(([name, value, ratio, yoy]) => <React.Fragment key={name}><div className={`cost-detail-row cost-detail-primary ${expandedDetails[name] ? 'expanded' : ''}`}><button type="button" onClick={() => toggleDetail(name)}><span>{expandedDetails[name] ? '⌄' : '›'}</span>{name}</button><span>{value}</span><span>{ratio}</span><ChangeValue value={yoy}/></div>{expandedDetails[name] && (detailSubItems[name] || []).map(([subName, subValue, subRatio, subYoy]) => <div className="cost-detail-row cost-detail-sub" key={`${name}-${subName}`}><span>{subName}</span><span>{subValue}</span><span>{subRatio}</span><ChangeValue value={subYoy}/></div>)}</React.Fragment>)}</div></section><RankingTable rows={rows} title="各项目公司经营成本排名" sort={sort} onSort={onSort} period={period} onPeriodChange={onPeriodChange} formatNumber={formatNumber}/></div>
}

const sortDownAsset = '/ZSRoad_mobile/assets/figma-sort-down-default.svg'
const sortDownActiveAsset = '/ZSRoad_mobile/assets/figma-sort-down-active.svg'
const sortUpAsset = '/ZSRoad_mobile/assets/figma-sort-up-default.svg'
const sortUpActiveAsset = '/ZSRoad_mobile/assets/figma-sort-up-active.svg'

export function SortIcon({ active, direction }) {
  return <span className="sort-icon"><img src={active && direction === 'asc' ? sortUpActiveAsset : sortUpAsset} className="sort-up" alt=""/><img src={active && direction === 'desc' ? sortDownActiveAsset : sortDownAsset} className="sort-down" alt=""/></span>
}
