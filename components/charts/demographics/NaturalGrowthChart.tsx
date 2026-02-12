"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { MedianData } from "@/types/demographics"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartCard } from "@/components/charts/ChartCard"

const chartConfig = {
  cbr: {
    label: "Birth Rate",
    color: "var(--chart-2)",
  },
  cdr: {
    label: "Death Rate",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function NaturalGrowthChart({ location }: { location: string }) {
  return (
    <ChartCard<MedianData>
      endpoint="/api/demographics"
      title={`Natural Growth Rate – ${location} (2010–2040)`}
      location={location}
    >
      {(data) => <AreaContent data={data} />}
    </ChartCard>
  )
}

function AreaContent({ data }: { data: MedianData[] }) {
  const parsed = useMemo(
    () => data
      .filter((d) => Number(d.Time) >= 2010 && Number(d.Time) <= 2040)
      .map((d) => ({
        Time: d.Time,
        CBR: Number(d.CBR),
        CDR: Number(d.CDR),
        growth: Number((Number(d.CBR) - Number(d.CDR)).toFixed(2)),
      })),
    [data],
  )

  const latest = parsed[parsed.length - 1]

  return (
    <>
      <ChartContainer config={chartConfig}>
        <AreaChart data={parsed} margin={{ left: 4, right: 8 }}>
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
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => {
                  const label = name === "CBR" ? "Birth Rate" : "Death Rate"
                  return `${label}: ${Number(value).toFixed(2)} per 1,000`
                }}
              />
            }
          />
          <Area
            dataKey="CBR"
            type="natural"
            stroke="var(--color-cbr)"
            fill="var(--color-cbr)"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Area
            dataKey="CDR"
            type="natural"
            stroke="var(--color-cdr)"
            fill="var(--color-cdr)"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
      {latest && (
        <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full shrink-0" style={{ background: "var(--color-cbr)" }} />
            <span>Births: {latest.CBR.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full shrink-0" style={{ background: "var(--color-cdr)" }} />
            <span>Deaths: {latest.CDR.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground">
            Growth: <strong className="text-foreground">{latest.growth > 0 ? "+" : ""}{latest.growth.toFixed(1)}</strong>
          </span>
        </div>
      )}
    </>
  )
}
