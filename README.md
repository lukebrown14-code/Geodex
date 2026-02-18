# Geodex

Geodex is a country intelligence dashboard for exploring the demographic and economic profile of any nation. Search a country, dive into its population structure, vital statistics, and fiscal health — then compare it side-by-side with another to spot strengths, risks, and trends at a glance.

## Purpose

A single statistic rarely tells the full story. Geodex pulls together the indicators that matter — fertility, mortality, age structure, migration, GDP, inflation, debt, and more — grades each against established benchmarks, and surfaces them in one coherent view. The result is a clear, honest picture of where a country stands and how it compares.

## Features

### Multi-Country Tabs & Comparison

Open multiple countries as tabs — each tab persists so you can switch between them instantly. When two or more tabs are open, a **VS** pill appears on inactive tabs. Click it to activate a side-by-side comparison: charts overlay both datasets using colour-coded series, and the health score cards display both countries' indicators and grades together. A status bar below the tabs shows the active comparison and provides a one-click clear button.

### Country Search with Autocomplete

Start typing a country name and an autocomplete dropdown appears with matching results. Navigate suggestions with arrow keys, select with Enter or click, and dismiss with Escape. The dropdown uses a substring match so typing "land" will surface Iceland, Ireland, Finland, etc.

### Demographic Health Score

Each country receives an overall grade (A through F) based on six indicators scored against international benchmarks.
Both extremes are penalized — a fertility rate of 1.1 is just as concerning as 6.0. Each indicator shows a traffic light
(green/yellow/red) with a plain-English explanation.

| Indicator                 | Healthy     | Warning            | Unhealthy    |
| ------------------------- | ----------- | ------------------ | ------------ |
| Life Expectancy           | 75+ years   | 65–75              | <65          |
| Infant Mortality (per 1k) | <10         | 10–30              | 30+          |
| Fertility Rate (TFR)      | 1.8–2.5     | 1.3–1.8 or 2.5–4.0 | <1.3 or 4.0+ |
| Median Age                | 25–38       | 20–25 or 38–45     | <20 or 45+   |
| Natural Growth (CBR-CDR)  | 2–15 per 1k | 0–2 or 15–25       | <0 or 25+    |
| Dependency Ratio          | <60%        | 60–80%             | 80%+         |

### Population Structure Analysis

- **Population Pyramid** — age and sex distribution (2026 snapshot)
- **Median Age Trend** — aging trajectory from 2010–2040
- **Dependency Ratio** — split into youth (0–15) and old-age (60+) components
- **Sex Ratio by Age** — males per 100 females across age groups
- **Population Density** — people per km² with a visual gauge and density level

### Vital Reproduction Metrics

- **Natural Growth Rate** — crude birth rate vs crude death rate over time
- **Total Fertility Rate (TFR)** — children per woman, 2010–2040
- **Infant Mortality** — deaths per 1,000 live births, 2010–2040
- **Net Migration** — immigration vs emigration with logarithmic scale
- **Life Expectancy** — trend from 2010–2040

### Economic Health Score

Each country receives an overall economic grade (A through F) based on six indicators scored against established benchmarks.
Each indicator shows a traffic light (green/yellow/red) with a plain-English explanation.

| Indicator                  | Healthy        | Warning              | Unhealthy       |
| -------------------------- | -------------- | -------------------- | --------------- |
| GDP Growth (% annual)      | >2%            | 0–2%                 | <0%             |
| GDP per Capita (USD)       | $20,000+       | $5,000–$20,000       | <$5,000         |
| Inflation (CPI %)          | 1–3%           | 0–1% or 3–6%         | <0% or 6%+      |
| Unemployment Rate (%)      | <5%            | 5–10%                | 10%+            |
| Public Debt (% of GDP)     | <60%           | 60–90%               | 90%+            |
| Current Account (% of GDP) | Surplus (>0%)  | Mild deficit (0–-3%) | Deficit (<-3%)  |

### Economic Indicators

- **GDP** — total gross domestic product over time
- **GDP Growth** — annual percentage change in GDP
- **GDP per Capita** — GDP divided by population, tracking standard of living
- **Inflation** — consumer price index percentage change over time
- **Unemployment** — unemployment rate trend

### Fiscal & Trade

- **Revenue vs Expense** — government revenue and expenditure as an area chart
- **Public Debt** — government debt as a percentage of GDP
- **Current Account Balance** — trade surplus or deficit as a percentage of GDP

## Data Source

All data comes from the
[UN World Population Prospects](https://population.un.org/wpp/downloads?folder=Standard%20Projections&group=CSV%20format),
stored in Supabase with two tables:

- **Pop5YearGroup** — population by 5-year age group and sex (2026)
- **DemographicIndicators** — time-series demographic metrics (all years)
- **WBD** — World Bank economic indicators (GDP, inflation, unemployment, debt, trade)

## Tech Stack

- **Next.js** (App Router) with React
- **Supabase** for data storage
- **Recharts** for visualizations
- **shadcn/ui** for component primitives
- **Tailwind CSS** for styling
- **next-themes** for dark/light mode

## Getting Started

```bash
npm install
```

Create a `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_KEY=your_key
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and search for a country.

## Background Reading

- [BBC Bitesize — Population Structure](https://www.bbc.co.uk/bitesize/articles/zvjrqyc)
- [Population Pyramids — Types Guide](https://www.populationpyramids.org/blog/population-pyramid-types-complete-guide)
- [OECD — Health at a Glance 2025](https://www.oecd.org/en/publications/health-at-a-glance-2025_8f9e3f98-en.html)
- [World Bank — Development Indicators](https://data.worldbank.org/indicator)

## Todo

- Add more economic data sources
