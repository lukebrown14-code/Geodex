"use client"

import { useMemo } from "react"
import { MedianData } from "@/types/population"
import { ChartCard } from "@/components/charts/demographics/ChartCard"

// Reference points (people per km²) for the spectrum
const DENSITY_BANDS = [
  { max: 10, label: "Very Low", color: "var(--chart-2)" },
  { max: 50, label: "Low", color: "var(--chart-4)" },
  { max: 200, label: "Moderate", color: "var(--chart-1)" },
  { max: 500, label: "High", color: "var(--chart-3)" },
  { max: Infinity, label: "Very High", color: "var(--chart-5)" },
] as const

export function PopulationDensityCard({ location }: { location: string }) {
  return (
    <ChartCard<MedianData>
      endpoint="/api/demographics"
      title={`Population Density – ${location}`}
      location={location}
    >
      {(raw) => <DensityContent raw={raw} />}
    </ChartCard>
  )
}

function DensityContent({ raw }: { raw: MedianData[] }) {
  const latest = raw
    .filter((d) => d.PopDensity != null)
    .sort((a, b) => b.Time - a.Time)[0]

  const band = useMemo(() => {
    if (!latest) return null
    return DENSITY_BANDS.find((b) => latest.PopDensity <= b.max) ?? DENSITY_BANDS[DENSITY_BANDS.length - 1]
  }, [latest])

  if (!latest || !band) return null

  const density = latest.PopDensity
  const totalPop = latest.TPopulation1July

  // Map density onto a 0–100 scale (log scale, capped at ~2000)
  const pct = Math.min(100, (Math.log10(Math.max(density, 1)) / Math.log10(2000)) * 100)

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Main stat */}
      <div className="flex items-baseline gap-3">
        <span
          className="text-5xl font-bold tracking-tighter leading-none"
          style={{ color: band.color }}
        >
          {density.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground">people</span>
          <span className="text-xs font-medium text-muted-foreground">per km²</span>
        </div>
      </div>

      {/* Gauge bar */}
      <div className="space-y-2">
        <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
          {/* Gradient fill */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, var(--chart-2), ${band.color})`,
            }}
          />
          {/* Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-5 w-1.5 rounded-full bg-foreground shadow-sm transition-all duration-700 ease-out"
            style={{ left: `${pct}%`, transform: `translate(-50%, -50%)` }}
          />
        </div>
        {/* Scale labels */}
        <div className="flex justify-between text-[10px] text-muted-foreground/60">
          <span>1</span>
          <span>10</span>
          <span>100</span>
          <span>1,000</span>
        </div>
      </div>

      {/* Details row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/50 px-3 py-2.5">
          <p className="text-xs text-muted-foreground">Total Population</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">
            {totalPop >= 1000
              ? `${(totalPop / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`
              : `${totalPop.toLocaleString(undefined, { maximumFractionDigits: 0 })}K`}
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 px-3 py-2.5">
          <p className="text-xs text-muted-foreground">Density Level</p>
          <p className="text-sm font-semibold mt-0.5" style={{ color: band.color }}>
            {band.label}
          </p>
        </div>
      </div>
    </div>
  )
}
