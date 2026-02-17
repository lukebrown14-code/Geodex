"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartCard } from "@/components/charts/ChartCard";
import { EconomicData } from "@/types/economics";

const TYPE_MAP: Record<
  string,
  { graphTitle: string; dataKey: keyof EconomicData; configKey: string; color: string; format?: (v: number) => string; info: string; infoFn: (data: EconomicData[]) => string }
> = {
  GDP: {
    graphTitle: "GDP (Current USD)",
    dataKey: "GDP (Current USD)",
    configKey: "gdp",
    color: "var(--chart-1)",
    format: (v) => `$${(v / 1e9).toFixed(0)}B`,
    info: "Total economic output measured in current US dollars.",
    infoFn: (data) => {
      const sorted = [...data].filter(d => d["GDP (Current USD)"] != null).sort((a, b) => b.year - a.year)
      if (sorted.length < 2) return ""
      const latest = Number(sorted[0]["GDP (Current USD)"])
      const prev = Number(sorted[1]["GDP (Current USD)"])
      const trend = latest > prev ? "trending up" : latest < prev ? "trending down" : "stable"
      return `Latest: $${(latest / 1e9).toFixed(0)}B (${trend})`
    },
  },
  "GDP Growth": {
    graphTitle: "GDP Growth (% Annual)",
    dataKey: "GDP Growth (% Annual)",
    configKey: "gdpGrowth",
    color: "var(--chart-2)",
    format: (v) => `${v.toFixed(1)}%`,
    info: "Annual percentage change in GDP, showing economic expansion or contraction.",
    infoFn: (data) => {
      const sorted = [...data].filter(d => d["GDP Growth (% Annual)"] != null).sort((a, b) => b.year - a.year)
      if (sorted.length === 0) return ""
      const v = Number(sorted[0]["GDP Growth (% Annual)"])
      return `Latest growth rate: ${v.toFixed(1)}%`
    },
  },
  "GDP per Capita": {
    graphTitle: "GDP per Capita (USD)",
    dataKey: "GDP per Capita (Current USD)",
    configKey: "gdpPerCapita",
    color: "var(--chart-3)",
    format: (v) => `$${v >= 1000 ? `${(v / 1e3).toFixed(1)}K` : v.toFixed(0)}`,
    info: "GDP divided by population, indicating average economic output per person.",
    infoFn: (data) => {
      const sorted = [...data].filter(d => d["GDP per Capita (Current USD)"] != null).sort((a, b) => b.year - a.year)
      if (sorted.length === 0) return ""
      const v = Number(sorted[0]["GDP per Capita (Current USD)"])
      const level = v >= 20000 ? "high income" : v >= 5000 ? "middle income" : "low income"
      return `Latest: $${v >= 1000 ? `${(v / 1e3).toFixed(1)}K` : v.toFixed(0)} (${level})`
    },
  },
  Inflation: {
    graphTitle: "Inflation (CPI %)",
    dataKey: "Inflation (CPI %)",
    configKey: "inflation",
    color: "var(--chart-4)",
    format: (v) => `${v.toFixed(1)}%`,
    info: "Rate of consumer price increases, measured by CPI.",
    infoFn: (data) => {
      const sorted = [...data].filter(d => d["Inflation (CPI %)"] != null).sort((a, b) => b.year - a.year)
      if (sorted.length === 0) return ""
      const v = Number(sorted[0]["Inflation (CPI %)"])
      const assessment = v >= 1 && v <= 3 ? "stable" : v > 3 && v <= 6 ? "elevated" : v > 6 ? "high" : "very low"
      return `Latest rate: ${v.toFixed(1)}% (${assessment})`
    },
  },
  Unemployment: {
    graphTitle: "Unemployment Rate (%)",
    dataKey: "Unemployment Rate (%)",
    configKey: "unemployment",
    color: "var(--chart-5)",
    format: (v) => `${v.toFixed(1)}%`,
    info: "Percentage of the labor force without employment.",
    infoFn: (data) => {
      const sorted = [...data].filter(d => d["Unemployment Rate (%)"] != null).sort((a, b) => b.year - a.year)
      if (sorted.length === 0) return ""
      return `Latest rate: ${Number(sorted[0]["Unemployment Rate (%)"]).toFixed(1)}%`
    },
  },
  "Public Debt": {
    graphTitle: "Public Debt (% of GDP)",
    dataKey: "Public Debt (% of GDP)",
    configKey: "publicDebt",
    color: "var(--chart-1)",
    format: (v) => `${v.toFixed(0)}%`,
    info: "Total government debt as percentage of GDP.",
    infoFn: (data) => {
      const sorted = [...data].filter(d => d["Public Debt (% of GDP)"] != null).sort((a, b) => b.year - a.year)
      if (sorted.length === 0) return ""
      return `Latest: ${Number(sorted[0]["Public Debt (% of GDP)"]).toFixed(0)}% of GDP`
    },
  },
  "Interest Rate": {
    graphTitle: "Interest Rate (Real, %)",
    dataKey: "Interest Rate (Real, %)",
    configKey: "interestRate",
    color: "var(--chart-3)",
    format: (v) => `${v.toFixed(1)}%`,
    info: "Real interest rate adjusted for inflation.",
    infoFn: (data) => {
      const sorted = [...data].filter(d => d["Interest Rate (Real, %)"] != null).sort((a, b) => b.year - a.year)
      if (sorted.length === 0) return ""
      return `Latest rate: ${Number(sorted[0]["Interest Rate (Real, %)"]).toFixed(1)}%`
    },
  },
};

export function EconLineChart({
  location,
  type,
}: {
  location: string;
  type: string;
}) {
  const meta = TYPE_MAP[type] ?? TYPE_MAP.GDP;

  const chartConfig = {
    [meta.configKey]: {
      label: meta.graphTitle,
      color: meta.color,
    },
  } satisfies ChartConfig;

  return (
    <ChartCard<EconomicData>
      endpoint="/api/economics"
      title={meta.graphTitle}
      location={location}
      info={meta.info}
      infoFn={meta.infoFn}
    >
      {(data) => (
        <LineContent
          data={data}
          dataKey={meta.dataKey as string}
          chartConfig={chartConfig}
          configKey={meta.configKey}
          format={meta.format}
        />
      )}
    </ChartCard>
  );
}

function LineContent({
  data,
  dataKey,
  chartConfig,
  configKey,
  format,
}: {
  data: EconomicData[];
  dataKey: string;
  chartConfig: ChartConfig;
  configKey: string;
  format?: (v: number) => string;
}) {
  const parsed = useMemo(
    () =>
      data
        .filter((d) => d.year != null && d[dataKey as keyof EconomicData] != null)
        .sort((a, b) => a.year - b.year)
        .map((d) => {
          const raw = d[dataKey as keyof EconomicData]
          const val = typeof raw === "string" ? parseFloat(raw) : Number(raw)
          return { year: d.year, [dataKey]: val }
        })
        .filter((d) => !isNaN(d[dataKey] as number)),
    [data, dataKey],
  );

  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={parsed}
        margin={{ left: 4, right: 8 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          width={55}
          fontSize={12}
          tickFormatter={format}
          domain={([dataMin, dataMax]: [number, number]) => {
            const padding = (dataMax - dataMin) * 0.1 || 1;
            return [
              Math.floor(dataMin - padding),
              Math.ceil(dataMax + padding),
            ];
          }}
          allowDecimals={true}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey={dataKey}
          type="natural"
          stroke={`var(--color-${configKey})`}
          strokeWidth={2}
          dot={{ fill: `var(--color-${configKey})` }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
