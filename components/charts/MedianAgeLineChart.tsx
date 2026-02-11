"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useMemo } from "react"
import { useApiData } from "@/hooks/useApiData"
import { MedianData } from "@/types/population"

export function DemoLineChart({ location, type }: { location: string, type: string }) {
  const params = useMemo(
    () => (location ? { location } : undefined),
    [location],
  )
  const { data, loading, error } = useApiData<MedianData>("/api/demographics", params)

  let graphTitle;
  let dataKey;

  if (type === "median") {
    graphTitle = "Median Age"
    dataKey = "MedianAgePop"
  }

  if (type === "TFR") {
    graphTitle = "Total Fertility Rate (TFR)"
    dataKey = "TFR"
  }

  if (type === "InfantDeaths") {
    graphTitle = "Infant Mortality"
    dataKey = "InfantDeaths"
  }

  const chartConfig = {
    medianAge: {
      label: graphTitle,
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>{graphTitle} (2000 - 2030)</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
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
      </CardContent>
    </Card>
  )
}
