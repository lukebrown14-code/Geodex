"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Cell, Label, ReferenceLine, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartCard } from "@/components/charts/ChartCard"
import { MedianData } from "@/types/population"

const chartConfig = {
  positive: {
    label: "Net Immigration",
    color: "var(--chart-1)",
  },
  negative: {
    label: "Net Emigration",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function symLog(value: number): number {
  return Math.sign(value) * Math.log10(1 + Math.abs(value))
}

function symExp(value: number): number {
  return Math.sign(value) * (Math.pow(10, Math.abs(value)) - 1)
}

export function DemoBarChart({ location }: { location: string }) {
  return (
    <ChartCard<MedianData>
      endpoint="/api/demographics"
      title={`Net Migration – ${location} (2000–2030)`}
      location={location}
    >
      {(raw) => <BarContent raw={raw} />}
    </ChartCard>
  )
}

function BarContent({ raw }: { raw: MedianData[] }) {
  const data = useMemo(
    () => raw.map((d) => ({ ...d, NetMigrationsLog: symLog(d.NetMigrations) })),
    [raw],
  )

  return (
    <>
      <ChartContainer config={chartConfig}>
        <BarChart
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
            tickFormatter={(value) => {
              const original = symExp(value)
              return `${Math.round(original).toLocaleString()}k`
            }}
          >
            <Label value="Immigration ↑" position="insideTopLeft" offset={10} style={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
            <Label value="↓ Emigration" position="insideBottomLeft" offset={10} style={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
          </YAxis>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => {
                  const original = symExp(Number(value))
                  return `${Math.round(original).toLocaleString()}k`
                }}
              />
            }
          />
          <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
          <Bar dataKey="NetMigrationsLog" radius={[4, 4, 4, 4]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.NetMigrationsLog >= 0 ? "var(--color-positive)" : "var(--color-negative)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      <div className="mt-4 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ background: "var(--color-positive)" }} />
          <span>Net Immigration</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ background: "var(--color-negative)" }} />
          <span>Net Emigration</span>
        </div>
      </div>
    </>
  )
}
