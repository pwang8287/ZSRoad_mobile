import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ChartPie, CircleDollarSign, Database } from 'lucide-react'
import { EProfitTrend, ECompanyBars } from './charts'
import { CostPage, FilterBar, Heading, MetricCard, MonthPickerPopup, OrganizationPopup, RankingTable, RevenueDetailPage, RevenuePage, RouteStatusBar, SegmentPage } from './components/DashboardComponents'
import { formatNumber } from './utils/formatters'
import './styles.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components/header.css'
import './styles/components/navigation.css'
import './styles/components/filters.css'
import './styles/components/table.css'
import './styles/components/chart.css'
import './styles/components/popup.css'
import './styles/pages/overview.css'
import './styles/pages/revenue.css'
import './styles/pages/revenue-detail.css'
import './styles/pages/cost.css'
import './styles/pages/segment.css'

const ranks = [
  ['甬台温高速','181.10','+2.35%','-4.32%','正常'], ['宁波交通科技','181.10','-4.32%','+12.35%','异常'], ['九龙高速','181.10','+2.35%','-','未知'], ['桂林公司','181.10','-4.32%','-4.32%','正常'], ['京津塘高速','181.10','+2.35%','-4.32%','正常'], ['贵黄公司','181.10','-4.32%','-4.32%','正常'], ['鄂东大桥','181.10','+2.35%','-4.32%','正常'], ['重庆公司','181.10','-4.32%','-4.32%','正常'], ['亳阜高速','181.10','+2.35%','-4.32%','正常'], ['京台高速','181.10','-4.32%','-4.32%','正常'], ['岑兴兴梧','181.10','+2.35%','-4.32%','正常'], ['富帆高速','181.10','-4.32%','-4.32%','正常'], ['垫忠高速','181.10','+2.35%','-4.32%','正常'], ['锦沙高速','181.10','-4.32%','-4.32%','正常'], ['平正高速','181.10','+2.35%','-4.32%','正常'], ['德商高速','181.10','-4.32%','-4.32%','正常'], ['神榆高速','181.10','+2.35%','-4.32%','正常'], ['神往米高速','181.10','-4.32%','-4.32%','正常']
]

const organizations = [
  '招商公路',
  '甬台温高速',
  '桂林公司',
  '重庆公司',
  '九瑞高速',
  '京津塘高速',
  '宁波交通科技',
  '亳阜高速'
]

const organizationData = {
  '招商公路': {
    month: { rate: '34%', income: '421.79', cost: '221.79', profit: '181.10' },
    year: { rate: '34%', income: '421.79', cost: '221.79', profit: '181.10' },
    trend: { profit: [100,120,230,100,130,165,195,205,180,140,210,145], income: [150,100,200,100,220,230,230,120,100,210,215,145], cost: [125,120,130,170,120,165,130,225,100,150,205,125] },
    bars: { profit: [100,140,230,100,130,120,120,125,180,160,100,110], income: [150,160,200,140,170,120,130,200,220,130,110,190], cost: [180,195,160,210,185,150,160,220,225,130,125,170] }
  },
  '桂林公司': {
    month: { rate: '31%', income: '318.60', cost: '176.42', profit: '142.18' },
    year: { rate: '32%', income: '1,204.80', cost: '684.20', profit: '520.60' },
    trend: { profit: [80,110,175,92,118,142,158,170,151,132,186,129], income: [120,96,168,88,184,198,190,108,92,176,192,126], cost: [105,108,120,142,112,148,126,190,88,134,178,116] },
    bars: { profit: [86,128,196,112], income: [132,148,182,126], cost: [156,174,148,188] },
    comparisonNames: ['阳平高速','桂阳高速','桂兴高速','灵三高速'],
    ranks: [['阳平高速','142.18','+2.35%','-4.32%','正常'],['桂阳高速','136.42','-4.32%','+12.35%','异常'],['桂兴高速','128.70','+2.35%','-4.32%','未知'],['灵三高速','119.64','-4.32%','+2.35%','正常']]
  }
}

function App() {
  const [period, setPeriod] = useState('月')
  const [trendPeriod, setTrendPeriod] = useState('当月')
  const [companyPeriod, setCompanyPeriod] = useState('当月')
  const [activeTab, setActiveTab] = useState('利润')
  const [page, setPage] = useState('overview')
  const [sort, setSort] = useState({ key: 'profit', direction: 'desc' })
  const [organization, setOrganization] = useState('招商公路')
  const [organizationOpen, setOrganizationOpen] = useState(false)
  const now = new Date()
  const currentMonth = { year: now.getFullYear(), month: now.getMonth() + 1 }
  const initialMonth = { year: 2026, month: 4 }
  const [selectedMonth, setSelectedMonth] = useState(initialMonth)
  const [draftMonth, setDraftMonth] = useState(initialMonth)
  const [timeOpen, setTimeOpen] = useState(false)
  const years = Array.from({ length: Math.max(1, currentMonth.year - 2023 + 1) }, (_, index) => 2023 + index)
  const months = Array.from({ length: 12 }, (_, index) => index + 1)
  const canSelectMonth = (year, month) => year < currentMonth.year || (year === currentMonth.year && month <= currentMonth.month)
  const visibleMonths = months.filter(month => canSelectMonth(draftMonth.year, month))
  const toggleSort = key => setSort(current => ({ key, direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc' }))
  const navigateTab = (tab, nextPage) => {
    setActiveTab(tab)
    setPage(nextPage)
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }))
  }
  const dashboardData = organizationData[organization] || organizationData['招商公路']
  const isProjectCompany = organization !== '招商公路'
  const sortedRanks = [...(dashboardData.ranks || ranks)].sort((a, b) => { const indexes = { profit: 1, yoy: 2, mom: 3, status: 4 }; const index = indexes[sort.key]; const av = a[index]; const bv = b[index]; const an = parseFloat(String(av).replace('%', '')); const bn = parseFloat(String(bv).replace('%', '')); const result = Number.isNaN(an) || Number.isNaN(bn) ? String(av).localeCompare(String(bv), 'zh-CN') : an - bn; return sort.direction === 'asc' ? result : -result })
  return <div className={`app ${activeTab === '路段' ? 'route-app' : ''} ${page === 'revenue' || page === 'revenue-detail' ? 'revenue-app' : ''} ${page === 'revenue-detail' ? 'revenue-detail-app' : ''} ${page === 'cost' ? 'cost-app' : ''} ${isProjectCompany ? 'is-project-company' : ''}`}>
    <header className="header"><div className="system"><img className="status-bar-image" src="/assets/figma-status-bar.svg" alt="" /></div><div className="header-title">{page === 'revenue-detail' && <button type="button" className="revenue-back" aria-label="返回收入分析" onClick={() => setPage('revenue')}><span>‹</span></button>}<h1>{page === 'revenue' || page === 'revenue-detail' ? `${organization}收入分析` : page === 'cost' ? `${organization}成本分析` : '一路一分析'}</h1></div><FilterBar organization={organization} organizationOpen={organizationOpen} onOrganizationOpen={() => setOrganizationOpen(true)} month={selectedMonth} timeOpen={timeOpen} onTimeOpen={() => { setDraftMonth(selectedMonth); setTimeOpen(true) }} /></header>
    <OrganizationPopup visible={organizationOpen} value={organization} options={organizations} onChange={setOrganization} onClose={() => setOrganizationOpen(false)} />
    <MonthPickerPopup visible={timeOpen} draft={draftMonth} years={years} visibleMonths={visibleMonths} onChange={(value, key) => setDraftMonth(current => { const year = key === 'year' ? Number(value.year) : current.year; const monthOptions = months.filter(month => canSelectMonth(year, month)); const month = key === 'month' ? Number(value.month) : Math.min(current.month, monthOptions[monthOptions.length - 1] || 1); return { year, month } })} onConfirm={() => { setSelectedMonth(draftMonth); setTimeOpen(false) }} onClose={() => setTimeOpen(false)} />
    <main>
      {page === 'revenue' ? <RevenuePage rows={sortedRanks} isProjectCompany={isProjectCompany} rankingTitle={isProjectCompany ? '各路段通行费收入排名' : '各公司通行费收入排名'} sort={sort} onSort={toggleSort} period={period} onPeriodChange={setPeriod} formatNumber={formatNumber} onMoreAnalysis={() => { setPage('revenue-detail'); requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })) }}/> : page === 'revenue-detail' ? <RevenueDetailPage rows={sortedRanks} sort={sort} onSort={toggleSort} period={period} onPeriodChange={setPeriod} formatNumber={formatNumber}/> : page === 'cost' ? <CostPage rows={sortedRanks} isProjectCompany={isProjectCompany} sort={sort} onSort={toggleSort} period={period} onPeriodChange={setPeriod} formatNumber={formatNumber}/> : activeTab === '路段' ? <SegmentPage period={period} onPeriodChange={setPeriod} sort={sort} onSort={toggleSort} formatNumber={formatNumber} /> : <>
      <section className="overview overview-page"><div className="overview-meta"><span>单位：<b>万元</b></span><span className="updated">数据更新时间：2026-04-01</span></div><Heading title="本月" unit={false}/><div className="metric-row month-metric-row"><MetricCard title="净利率" value={dashboardData.month.rate} change="-3.41%"/><MetricCard title="通行费收入" value={dashboardData.month.income} change="+10%"/><MetricCard title="经营成本" value={dashboardData.month.cost} change="+10%"/><MetricCard title="净利润" value={dashboardData.month.profit} change="+2.35%"/></div><Heading title="本年" unit={false}/><div className="metric-row year-metric-row"><MetricCard title="净利率" value={dashboardData.year.rate} change="-3.41%"/><MetricCard title="通行费收入" value={dashboardData.year.income} change="+10%"/><MetricCard title="经营成本" value={dashboardData.year.cost} change="+10%"/><MetricCard title="净利润" value={dashboardData.year.profit} change="+2.35%"/></div></section>
      <section className="chart-section"><Heading title="利润趋势" unit={false}><div className="chart-period-switch"><button className={trendPeriod === '当月' ? 'on' : ''} onClick={() => setTrendPeriod('当月')}>当月</button><button className={trendPeriod === '年累计' ? 'on' : ''} onClick={() => setTrendPeriod('年累计')}>年累计</button></div></Heading><EProfitTrend data={dashboardData.trend} period={trendPeriod}/></section>
      <section className="chart-section company-chart"><Heading title={organization === '桂林公司' ? '各路段利润对比' : '项目公司利润对比'} unit={false}><div className="chart-period-switch"><button className={companyPeriod === '当月' ? 'on' : ''} onClick={() => setCompanyPeriod('当月')}>当月</button><button className={companyPeriod === '年累计' ? 'on' : ''} onClick={() => setCompanyPeriod('年累计')}>年累计</button></div></Heading><ECompanyBars data={dashboardData.bars} names={dashboardData.comparisonNames} period={companyPeriod}/></section>
      <RankingTable rows={sortedRanks} title={organization === '桂林公司' ? '各路段利润排名' : '各公司利润排名'} sort={sort} onSort={toggleSort} period={period} onPeriodChange={setPeriod} formatNumber={formatNumber} />
      </>}
    </main>
    <nav className="bottom-nav"><button className={activeTab === '利润' ? 'active' : ''} onClick={() => navigateTab('利润', 'overview')}><Database size={19}/><span>利润</span></button><button className={activeTab === '收入' ? 'active' : ''} onClick={() => navigateTab('收入', 'revenue')}><CircleDollarSign size={19}/><span>收入</span></button><button className={activeTab === '成本' ? 'active' : ''} onClick={() => navigateTab('成本', 'cost')}><ChartPie size={19}/><span>成本</span></button></nav>
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
