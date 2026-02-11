# Country Statistics Dashboard

An interactive demographic data explorer that lets you search any country and instantly assess the health of its
population through visualizations and a composite scoring system.

## Purpose

Understanding whether a country has healthy demographics requires looking beyond a single number. This dashboard brings
together the key indicators — fertility, mortality, age structure, migration, and density — into one view, and grades
them against established benchmarks so you can quickly spot strengths and risks.

## Features

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

## Data Source

All data comes from the
[UN World Population Prospects](https://population.un.org/wpp/downloads?folder=Standard%20Projections&group=CSV%20format),
stored in Supabase with two tables:

- **Pop5YearGroup** — population by 5-year age group and sex (2026)
- **DemographicIndicators** — time-series demographic metrics (all years)

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

- Add autocomplete when using search bar
- Add economically data tab, to see the health of the country economy
- Add compare tool. So you can compare to countries side by side
