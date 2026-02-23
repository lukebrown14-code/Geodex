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

interface MetricConfig {
  title: string
  dataKey: keyof EconomicData
  valueKey: string
  color: string
  tooltipSuffix: string
  /** When true, bars are colored by sign and a zero reference line + legend are shown */
  bipolar?: boolean
  positiveLabel?: string
  negativeLabel?: string
  positiveColor?: string
  negativeColor?: string
  info: string
  infoFn: (data: EconomicData[]) => string
}

const METRIC_MAP: Record<string, MetricConfig> = {
  "GDP Growth": {
    title: "GDP Growth (% Annual)",
    dataKey: "GDP Growth (% Annual)",
    valueKey: "growth",
    color: "var(--chart-2)",
    tooltipSuffix: "%",
    bipolar: true,
    positiveLabel: "Growth",
    negativeLabel: "Contraction",
    positiveColor: "var(--chart-2)",
    negativeColor: "var(--chart-3)",
    info: "Annual GDP growth rate shown as bars.",
    infoFn: (data) => {
      const valid = data.filter(d => d["GDP Growth (% Annual)"] != null)
      if (valid.length === 0) return ""
      const avg = valid.reduce((s, d) => s + Number(d["GDP Growth (% Annual)"]), 0) / valid.length
      return `Average growth over period: ${avg.toFixed(1)}%`
    },
  },
  "Public Debt": {
    title: "Public Debt (% of GDP)",
    dataKey: "Public Debt (% of GDP)",
    valueKey: "publicDebt",
    color: "var(--chart-1)",
    tooltipSuffix: "% of GDP",
    info: "Total government debt as percentage of GDP.",
    infoFn: (data) => {
      const sorted = [...data].filter(d => d["Public Debt (% of GDP)"] != null).sort((a, b) => b.year - a.year)
      if (sorted.length === 0) return ""
      return `Latest: ${Number(sorted[0]["Public Debt (% of GDP)"]).toFixed(0)}% of GDP`
    },
  },
}

export function EconMetricBarChart({
  location,
  type,
}: {
  location: string
  type: string
}) {
  const meta = METRIC_MAP[type]

  const chartConfig: ChartConfig = meta.bipolar
    ? {
        positive: { label: meta.positiveLabel!, color: meta.positiveColor! },
        negative: { label: meta.negativeLabel!, color: meta.negativeColor! },
      }
    : {
        [meta.valueKey]: { label: meta.title, color: meta.color },
      }

  return (
    <ChartCard<EconomicData>
      endpoint="/api/economics"
      title={meta.title}
      location={location}
      info={meta.info}
      infoFn={meta.infoFn}
    >
      {(raw) => (
        <BarContent raw={raw} meta={meta} chartConfig={chartConfig} />
      )}
    </ChartCard>
  )
}

function BarContent({
  raw,
  meta,
  chartConfig,
}: {
  raw: EconomicData[]
  meta: MetricConfig
  chartConfig: ChartConfig
}) {
  const data = useMemo(
    () =>
      raw
        .filter((d) => d[meta.dataKey] != null)
        .sort((a, b) => a.year - b.year)
        .map((d) => ({
          year: d.year,
          [meta.valueKey]: Number(d[meta.dataKey]),
        })),
    [raw, meta.dataKey, meta.valueKey],
  )

  if (data.length === 0) return null;

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
            width={55}
            fontSize={12}
            tickFormatter={(v) => `${v}%`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) =>
                  `${Number(value).toFixed(1)}${meta.tooltipSuffix}`
                }
              />
            }
          />
          {meta.bipolar && (
            <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
          )}
          <Bar
            dataKey={meta.valueKey}
            radius={meta.bipolar ? [4, 4, 4, 4] : [4, 4, 0, 0]}
            fill={meta.bipolar ? undefined : `var(--color-${meta.valueKey})`}
          >
            {meta.bipolar &&
              data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    (entry[meta.valueKey] as number) >= 0
                      ? "var(--color-positive)"
                      : "var(--color-negative)"
                  }
                />
              ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      {meta.bipolar && (
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: "var(--color-positive)" }} />
            <span>{meta.positiveLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: "var(--color-negative)" }} />
            <span>{meta.negativeLabel}</span>
          </div>
        </div>
      )}
    </>
  )
}
