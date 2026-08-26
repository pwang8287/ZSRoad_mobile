# Visual Baseline

## Capture Configuration

- Viewport: `375 x 812` CSS pixels
- URL: `http://127.0.0.1:5174/`
- Capture date: `2026-08-26`
- Data state: built-in demo data, organization `招商公路`, month `2026年4月`

## Pages To Capture

| Page | Entry action | Expected heading |
| --- | --- | --- |
| Overview | initial page | 一路一分析 |
| Revenue | bottom navigation, 收入 | 招商公路收入分析 |
| Revenue detail | 收入页 -> 查看更多分析 | 招商公路收入分析 |
| Cost | bottom navigation, 成本 | 招商公路成本分析 |
| Segment | route page entry when enabled | 路段 |

Screenshots should be saved under `docs/baseline/` using these names:

- `overview-375x812.png`
- `revenue-375x812.png`
- `revenue-detail-375x812.png`
- `cost-375x812.png`
- `segment-375x812.png`

## Interaction Checklist

- Header and filter bar remain fixed while the content scrolls.
- Ranking/detail tables scroll horizontally without moving the fixed rank and name columns.
- Organization filter opens a bottom popup; opening and closing alone does not redraw charts.
- Month filter opens the picker; only confirming a changed month updates page data.
- Profit/revenue/cost chart period switches update only the relevant chart.
- Ranking sort arrows show the active direction and reset inactive columns to gray.
- Revenue detail factor selector redraws the factor chart only after selecting an option.

## Capture Status

The local server is available at `http://127.0.0.1:5174/`, but no browser instance is available in the current environment. The five PNG captures therefore remain pending and must be generated in a browser-enabled session.
