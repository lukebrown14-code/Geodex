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
  nonWorking: {
    label: "Dependents (0–15, 60+)",
    color: "var(--chart-2)",
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
  const { working, nonWorking } = useMemo(() => {
    let working = 0
    let nonWorking = 0
    for (const record of raw) {
      const ageStr = record.AgeGrp
      const pop = record.PopMale + record.PopFemale

      if (ageStr === "100+") {
        nonWorking += pop
        continue
      }

      const age = Number(ageStr.split("-")[0])
      if (age <= 15 || age >= 60) {
        nonWorking += pop
      } else {
        working += pop
      }
    }
    return { working, nonWorking }
  }, [raw])

  const pieData = useMemo(() => [
    { name: "Working Age", value: Math.round(working), fill: "var(--color-working)" },
    { name: "Dependents", value: Math.round(nonWorking), fill: "var(--color-nonWorking)" },
  ], [working, nonWorking])

  const total = working + nonWorking
  const ratio = total > 0 ? ((nonWorking / working) * 100).toFixed(1) : "0"

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
      <div className="mt-4 text-center text-sm">
        <p>Dependency ratio: <strong>{ratio}%</strong></p>
        <div className="mt-2 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: "var(--color-working)" }} />
            <span>Working Age: {((working / total) * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: "var(--color-nonWorking)" }} />
            <span>Dependents: {((nonWorking / total) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </>
  )
}
