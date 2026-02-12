"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { EconomicData } from "@/types/population"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartCard } from "@/components/charts/demographics/ChartCard"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
  expense: {
    label: "Expense",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function EconAreaChart({ location }: { location: string }) {
  return (
    <ChartCard<EconomicData>
      endpoint="/api/economics"
      title={`Gov Revenue vs Expense – ${location}`}
      location={location}
    >
      {(data) => <AreaContent data={data} />}
    </ChartCard>
  )
}

function AreaContent({ data }: { data: EconomicData[] }) {
  const parsed = useMemo(
    () => data
      .filter((d) =>
        d["Government Revenue (% of GDP)"] != null &&
        d["Government Expense (% of GDP)"] != null
      )
      .sort((a, b) => a.year - b.year)
      .map((d) => ({
        year: d.year,
        revenue: parseFloat(d["Government Revenue (% of GDP)"]!),
        expense: parseFloat(d["Government Expense (% of GDP)"]!),
      }))
      .filter((d) => !isNaN(d.revenue) && !isNaN(d.expense)),
    [data],
  )

  const latest = parsed[parsed.length - 1]

  return (
    <>
      <ChartContainer config={chartConfig}>
        <AreaChart data={parsed} margin={{ left: 4, right: 8 }}>
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
            width={40}
            fontSize={12}
            tickFormatter={(v) => `${v}%`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => {
                  const label = name === "revenue" ? "Revenue" : "Expense"
                  return `${label}: ${Number(value).toFixed(1)}% GDP`
                }}
              />
            }
          />
          <Area
            dataKey="revenue"
            type="natural"
            stroke="var(--color-revenue)"
            fill="var(--color-revenue)"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Area
            dataKey="expense"
            type="natural"
            stroke="var(--color-expense)"
            fill="var(--color-expense)"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
      {latest && (
        <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full shrink-0" style={{ background: "var(--color-revenue)" }} />
            <span>Revenue: {latest.revenue.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full shrink-0" style={{ background: "var(--color-expense)" }} />
            <span>Expense: {latest.expense.toFixed(1)}%</span>
          </div>
          <span className="text-muted-foreground">
            Balance: <strong className="text-foreground">{(latest.revenue - latest.expense) > 0 ? "+" : ""}{(latest.revenue - latest.expense).toFixed(1)}%</strong>
          </span>
        </div>
      )}
    </>
  )
}
