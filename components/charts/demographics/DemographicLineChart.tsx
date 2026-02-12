"use client"

import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartCard } from "@/components/charts/ChartCard"
import { MedianData } from "@/types/demographics"

export function DemographicLineChart({ location, type }: { location: string, type: string }) {
  let graphTitle: string | undefined;
  let dataKey: string | undefined;

  if (type === "median") {
    graphTitle = "Median Age"
    dataKey = "MedianAgePop"
  }

  if (type === "TFR") {
    graphTitle = "Total Fertility Rate (TFR)"
    dataKey = "TFR"
  }

  if (type === "InfantDeaths") {
    graphTitle = "Infant Mortality (per thousands)"
    dataKey = "InfantDeaths"
  }

  if (type === "lifeExpect") {
    graphTitle = "Life Expectancy"
    dataKey = "LEx"
  }

  const colorMap: Record<string, { configKey: string; color: string }> = {
    median:       { configKey: "medianAge",    color: "var(--chart-1)" },
    TFR:          { configKey: "tfr",          color: "var(--chart-2)" },
    InfantDeaths: { configKey: "infantDeaths", color: "var(--chart-3)" },
    lifeExpect:   { configKey: "lifeExpect",   color: "var(--chart-4)" },
  }

  const { configKey, color } = colorMap[type] ?? colorMap.median

  const chartConfig = {
    [configKey]: {
      label: graphTitle,
      color,
    },
  } satisfies ChartConfig

  return (
    <ChartCard<MedianData>
      endpoint="/api/demographics"
      title={`${graphTitle} (2010 - 2040)`}
      location={location}
    >
      {(data) => (
        <LineContent data={data} dataKey={dataKey!} chartConfig={chartConfig} configKey={configKey} />
      )}
    </ChartCard>
  )
}

function LineContent({ data, dataKey, chartConfig, configKey }: { data: MedianData[], dataKey: string, chartConfig: ChartConfig, configKey: string }) {
  const parsed = useMemo(
    () => data
      .filter((d) => Number(d.Time) >= 2010 && Number(d.Time) <= 2040)
      .map((d) => ({ ...d, [dataKey]: Number(d[dataKey as keyof MedianData]) })),
    [data, dataKey],
  )

  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={parsed}
        margin={{ left: 4, right: 8 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="Time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          width={40}
          fontSize={12}
          domain={([dataMin, dataMax]: [number, number]) => {
            const padding = (dataMax - dataMin) * 0.1 || 1
            return [Math.floor(dataMin - padding), Math.ceil(dataMax + padding)]
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
  )
}
