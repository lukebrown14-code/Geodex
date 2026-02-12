"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartCard } from "@/components/charts/demographics/ChartCard";
import { EconomicData } from "@/types/population";

const TYPE_MAP: Record<
  string,
  { graphTitle: string; dataKey: keyof EconomicData; configKey: string; color: string; format?: (v: number) => string }
> = {
  GDP: {
    graphTitle: "GDP (Current USD)",
    dataKey: "GDP (Current USD)",
    configKey: "gdp",
    color: "var(--chart-1)",
    format: (v) => `$${(v / 1e9).toFixed(0)}B`,
  },
  "GDP Growth": {
    graphTitle: "GDP Growth (% Annual)",
    dataKey: "GDP Growth (% Annual)",
    configKey: "gdpGrowth",
    color: "var(--chart-2)",
    format: (v) => `${v.toFixed(1)}%`,
  },
  "GDP per Capita": {
    graphTitle: "GDP per Capita (USD)",
    dataKey: "GDP per Capita (Current USD)",
    configKey: "gdpPerCapita",
    color: "var(--chart-3)",
    format: (v) => `$${v >= 1000 ? `${(v / 1e3).toFixed(1)}K` : v.toFixed(0)}`,
  },
  Inflation: {
    graphTitle: "Inflation (CPI %)",
    dataKey: "Inflation (CPI %)",
    configKey: "inflation",
    color: "var(--chart-4)",
    format: (v) => `${v.toFixed(1)}%`,
  },
  Unemployment: {
    graphTitle: "Unemployment Rate (%)",
    dataKey: "Unemployment Rate (%)",
    configKey: "unemployment",
    color: "var(--chart-5)",
    format: (v) => `${v.toFixed(1)}%`,
  },
  "Public Debt": {
    graphTitle: "Public Debt (% of GDP)",
    dataKey: "Public Debt (% of GDP)",
    configKey: "publicDebt",
    color: "var(--chart-1)",
    format: (v) => `${v.toFixed(0)}%`,
  },
  "Interest Rate": {
    graphTitle: "Interest Rate (Real, %)",
    dataKey: "Interest Rate (Real, %)",
    configKey: "interestRate",
    color: "var(--chart-3)",
    format: (v) => `${v.toFixed(1)}%`,
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
