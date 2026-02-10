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

const chartConfig = {
  medianAge: {
    label: "Median Age",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function MedianAgeLineChart({ location }: { location: string }) {
  const params = useMemo(
    () => (location ? { location } : undefined),
    [location],
  )
  const { data, loading, error } = useApiData<MedianData>("/api/demographics", params)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Median Age – {location} (2000–2030)</CardTitle>
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
              dataKey="MedianAgePop"
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
