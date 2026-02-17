"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartCard } from "@/components/charts/ChartCard"
import { EconomicData } from "@/types/economics"

const chartConfig = {
  surplus: {
    label: "Surplus",
    color: "var(--chart-2)",
  },
  deficit: {
    label: "Deficit",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function EconBarChart({ location }: { location: string }) {
  return (
    <ChartCard<EconomicData>
      endpoint="/api/economics"
      title={`Current Account Balance – ${location}`}
      location={location}
      info="Difference between exports and imports of goods/services as % of GDP."
      infoFn={(data) => {
        const sorted = [...data].filter(d => d["Current Account Balance (% GDP)"] != null).sort((a, b) => b.year - a.year)
        if (sorted.length === 0) return ""
        const v = Number(sorted[0]["Current Account Balance (% GDP)"])
        return `Latest: ${v > 0 ? "+" : ""}${v.toFixed(1)}% GDP`
      }}
    >
      {(raw) => <BarContent raw={raw} />}
    </ChartCard>
  )
}

function BarContent({ raw }: { raw: EconomicData[] }) {
  const data = useMemo(
    () => raw
      .filter((d) => d["Current Account Balance (% GDP)"] != null)
      .sort((a, b) => a.year - b.year)
      .map((d) => ({
        year: d.year,
        balance: Number(d["Current Account Balance (% GDP)"]),
      })),
    [raw],
  )

  return (
    <>
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={data}
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
            width={45}
            fontSize={11}
            tickFormatter={(v) => `${v}%`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => `${Number(value).toFixed(1)}% GDP`}
              />
            }
          />
          <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
          <Bar dataKey="balance" radius={[4, 4, 4, 4]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.balance >= 0 ? "var(--color-surplus)" : "var(--color-deficit)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      <div className="mt-4 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ background: "var(--color-surplus)" }} />
          <span>Surplus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ background: "var(--color-deficit)" }} />
          <span>Deficit</span>
        </div>
      </div>
    </>
  )
}
