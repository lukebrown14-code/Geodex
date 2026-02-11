"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartCard } from "@/components/charts/ChartCard"
import { MedianData } from "@/types/population"

export function DemoLineChart({ location, type }: { location: string, type: string }) {
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

  const chartConfig = {
    medianAge: {
      label: graphTitle,
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <ChartCard<MedianData>
      endpoint="/api/demographics"
      title={`${graphTitle} (2000 - 2050)`}
      location={location}
    >
      {(data) => (
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="Time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey={dataKey}
              type="natural"
              stroke="var(--color-medianAge)"
              strokeWidth={2}
              dot={{ fill: "var(--color-medianAge)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      )}
    </ChartCard>
  )
}
