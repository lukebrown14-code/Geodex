"use client"

import { useMemo } from "react"
import { Pie, PieChart, Cell } from "recharts"
import { PopulationRecord } from "@/types/population"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartCard } from "@/components/charts/ChartCard"

const chartConfig = {
  working: {
    label: "Working Age (16–59)",
    color: "var(--chart-1)",
  },
  youth: {
    label: "Youth (0–15)",
    color: "var(--chart-4)",
  },
  elderly: {
    label: "Elderly (60+)",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function DependencyPieChart({ location }: { location: string }) {
  return (
    <ChartCard<PopulationRecord>
      endpoint="/api/population"
      title={`Dependency Ratio – ${location}`}
      location={location}
    >
      {(raw) => <PieContent raw={raw} />}
    </ChartCard>
  )
}

function PieContent({ raw }: { raw: PopulationRecord[] }) {
  const { working, youth, elderly } = useMemo(() => {
    let working = 0
    let youth = 0
    let elderly = 0
    for (const record of raw) {
      const ageStr = record.AgeGrp
      const pop = record.PopMale + record.PopFemale

      if (ageStr === "100+") {
        elderly += pop
        continue
      }

      const age = Number(ageStr.split("-")[0])
      if (age <= 15) {
        youth += pop
      } else if (age >= 60) {
        elderly += pop
      } else {
        working += pop
      }
    }
    return { working, youth, elderly }
  }, [raw])

  const pieData = useMemo(() => [
    { name: "Working Age", value: Math.round(working), fill: "var(--color-working)" },
    { name: "Youth (0–15)", value: Math.round(youth), fill: "var(--color-youth)" },
    { name: "Elderly (60+)", value: Math.round(elderly), fill: "var(--color-elderly)" },
  ], [working, youth, elderly])

  const total = working + youth + elderly
  const youthRatio = total > 0 ? ((youth / working) * 100).toFixed(1) : "0"
  const elderlyRatio = total > 0 ? ((elderly / working) * 100).toFixed(1) : "0"
  const totalRatio = total > 0 ? (((youth + elderly) / working) * 100).toFixed(1) : "0"

  if (total <= 0) return null

  return (
    <>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) =>
                  `${Number(value).toLocaleString()}k`
                }
              />
            }
          />
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            strokeWidth={2}
          >
            {pieData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="mt-4 text-center text-sm space-y-2">
        <p>Total dependency ratio: <strong>{totalRatio}%</strong></p>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <span>Youth: {youthRatio}%</span>
          <span>Old-age: {elderlyRatio}%</span>
        </div>
        <div className="mt-2 flex justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: "var(--color-working)" }} />
            <span>Working: {((working / total) * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: "var(--color-youth)" }} />
            <span>Youth: {((youth / total) * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: "var(--color-elderly)" }} />
            <span>Elderly: {((elderly / total) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </>
  )
}
