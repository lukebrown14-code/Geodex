"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"
import { PopulationRecord } from "@/types/population"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartCard } from "@/components/charts/ChartCard"

const chartConfig = {
  sexRatio: {
    label: "Sex Ratio",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function SexRatioChart({ location }: { location: string }) {
  return (
    <ChartCard<PopulationRecord>
      endpoint="/api/population"
      title={`Sex Ratio by Age – ${location}`}
      location={location}
    >
      {(raw) => <BarContent raw={raw} />}
    </ChartCard>
  )
}

function BarContent({ raw }: { raw: PopulationRecord[] }) {
  const data = useMemo(() => {
    return raw
      .filter((d) => d.AgeGrp !== "100+")
      .sort((a, b) => Number(a.AgeGrp.split("-")[0]) - Number(b.AgeGrp.split("-")[0]))
      .map((d) => ({
        age: d.AgeGrp,
        ratio: d.PopFemale > 0 ? Math.round((d.PopMale / d.PopFemale) * 100) : 0,
      }))
  }, [raw])

  const overallMale = raw.reduce((s, d) => s + d.PopMale, 0)
  const overallFemale = raw.reduce((s, d) => s + d.PopFemale, 0)
  const overallRatio = overallFemale > 0 ? ((overallMale / overallFemale) * 100).toFixed(1) : "N/A"

  return (
    <>
      <ChartContainer config={chartConfig}>
        <BarChart data={data} margin={{ left: 4, right: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="age"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={10}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={[
              (dataMin: number) => Math.floor(dataMin - 5),
              (dataMax: number) => Math.ceil(dataMax + 5),
            ]}
          />
          <ReferenceLine y={100} stroke="var(--color-sexRatio)" strokeDasharray="4 4" strokeOpacity={0.5} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => `${value} males per 100 females`}
              />
            }
          />
          <Bar dataKey="ratio" fill="var(--color-sexRatio)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ChartContainer>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Overall: <strong className="text-foreground">{overallRatio}</strong> males per 100 females
      </p>
    </>
  )
}
