"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApiData } from "@/hooks/useApiData"
import { EconomicData } from "@/types/population"

/* ── Scoring helpers ── */

type Rating = "healthy" | "warning" | "unhealthy"

interface IndicatorResult {
  label: string
  value: string
  rating: Rating
  detail: string
}

function rateGdpGrowth(v: number): IndicatorResult {
  const rating: Rating = v > 2 ? "healthy" : v >= 0 ? "warning" : "unhealthy"
  return {
    label: "GDP Growth",
    value: `${v.toFixed(1)}%`,
    rating,
    detail: v > 2 ? "Economy expanding" : v >= 0 ? "Slow growth" : "Economy contracting",
  }
}

function rateGdpPerCapita(v: number): IndicatorResult {
  const rating: Rating = v >= 20000 ? "healthy" : v >= 5000 ? "warning" : "unhealthy"
  return {
    label: "GDP per Capita",
    value: `$${v >= 1000 ? `${(v / 1e3).toFixed(1)}K` : v.toFixed(0)}`,
    rating,
    detail: v >= 20000 ? "High standard of living" : v >= 5000 ? "Middle income" : "Low income",
  }
}

function rateInflation(v: number): IndicatorResult {
  const rating: Rating = v >= 1 && v <= 3 ? "healthy" : (v > 3 && v <= 6) || (v >= 0 && v < 1) ? "warning" : "unhealthy"
  return {
    label: "Inflation",
    value: `${v.toFixed(1)}%`,
    rating,
    detail:
      v < 0 ? "Deflation risk" :
      v <= 3 ? "Price stability" :
      v <= 6 ? "Elevated inflation" :
      "High inflation",
  }
}

function rateUnemployment(v: number): IndicatorResult {
  const rating: Rating = v < 5 ? "healthy" : v <= 10 ? "warning" : "unhealthy"
  return {
    label: "Unemployment",
    value: `${v.toFixed(1)}%`,
    rating,
    detail: v < 5 ? "Strong labor market" : v <= 10 ? "Moderate unemployment" : "High unemployment",
  }
}

function ratePublicDebt(v: number): IndicatorResult {
  const rating: Rating = v < 60 ? "healthy" : v <= 90 ? "warning" : "unhealthy"
  return {
    label: "Public Debt",
    value: `${v.toFixed(0)}% GDP`,
    rating,
    detail: v < 60 ? "Fiscally sustainable" : v <= 90 ? "Elevated debt levels" : "High debt burden",
  }
}

function rateCurrentAccount(v: number): IndicatorResult {
  const rating: Rating = v > 0 ? "healthy" : v >= -3 ? "warning" : "unhealthy"
  return {
    label: "Current Account",
    value: `${v > 0 ? "+" : ""}${v.toFixed(1)}% GDP`,
    rating,
    detail: v > 0 ? "Trade surplus" : v >= -3 ? "Mild deficit" : "Significant trade deficit",
  }
}

/* ── Compute overall grade ── */

function computeGrade(indicators: IndicatorResult[]): { letter: string; color: string; bgColor: string; summary: string } {
  const scores = indicators.map((i) =>
    i.rating === "healthy" ? 3 : i.rating === "warning" ? 2 : 1
  )
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length

  if (avg >= 2.7) return { letter: "A", color: "#22c55e", bgColor: "rgba(34,197,94,0.1)", summary: "Strong economic health" }
  if (avg >= 2.3) return { letter: "B", color: "#84cc16", bgColor: "rgba(132,204,22,0.1)", summary: "Good with minor concerns" }
  if (avg >= 1.8) return { letter: "C", color: "#eab308", bgColor: "rgba(234,179,8,0.1)", summary: "Mixed economic signals" }
  if (avg >= 1.4) return { letter: "D", color: "#f97316", bgColor: "rgba(249,115,22,0.1)", summary: "Several areas of concern" }
  return { letter: "F", color: "#ef4444", bgColor: "rgba(239,68,68,0.1)", summary: "Critical economic challenges" }
}

/* ── Rating colors ── */

const RATING_STYLES: Record<Rating, { dot: string; text: string }> = {
  healthy:   { dot: "#22c55e", text: "text-green-500" },
  warning:   { dot: "#eab308", text: "text-yellow-500" },
  unhealthy: { dot: "#ef4444", text: "text-red-500" },
}

/* ── Component ── */

export function EconScoreCard({ location }: { location: string }) {
  const params = useMemo(() => ({ location }), [location])
  const { data, loading, error } = useApiData<EconomicData>("/api/economics", params)

  const { indicators, grade } = useMemo(() => {
    if (data.length === 0) return { indicators: [], grade: null }

    // Sort by year descending so we can find the most recent non-null value per metric
    const sorted = [...data].sort((a, b) => b.year - a.year)

    function findLatest<K extends keyof EconomicData>(key: K): number | null {
      for (const row of sorted) {
        const raw = row[key]
        if (raw != null) {
          const val = typeof raw === "string" ? parseFloat(raw) : Number(raw)
          if (!isNaN(val)) return val
        }
      }
      return null
    }

    const indicators: IndicatorResult[] = []

    const gdpGrowth = findLatest("GDP Growth (% Annual)")
    if (gdpGrowth != null) indicators.push(rateGdpGrowth(gdpGrowth))

    const gdpPc = findLatest("GDP per Capita (Current USD)")
    if (gdpPc != null) indicators.push(rateGdpPerCapita(gdpPc))

    const inflation = findLatest("Inflation (CPI %)")
    if (inflation != null) indicators.push(rateInflation(inflation))

    const unemployment = findLatest("Unemployment Rate (%)")
    if (unemployment != null) indicators.push(rateUnemployment(unemployment))

    const debt = findLatest("Public Debt (% of GDP)")
    if (debt != null) indicators.push(ratePublicDebt(debt))

    const currentAccount = findLatest("Current Account Balance (% GDP)")
    if (currentAccount != null) indicators.push(rateCurrentAccount(currentAccount))

    if (indicators.length === 0) return { indicators: [], grade: null }

    return { indicators, grade: computeGrade(indicators) }
  }, [data])

  return (
    <Card className="h-full col-span-full">
      <CardHeader>
        <CardTitle>Economic Health Score — {location}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div className="animate-pulse bg-muted rounded h-[140px]" />}
        {error && <p className="text-red-500">Error: {error}</p>}
        {grade && indicators.length > 0 && (
          <div className="flex gap-4 sm:gap-6 flex-col sm:flex-row">
            {/* Grade circle */}
            <div className="flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-0 shrink-0">
              <div
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl flex items-center justify-center border-2"
                style={{ borderColor: grade.color, backgroundColor: grade.bgColor }}
              >
                <span
                  className="text-4xl sm:text-5xl font-black tracking-tighter"
                  style={{ color: grade.color }}
                >
                  {grade.letter}
                </span>
              </div>
              <p className="text-xs text-muted-foreground sm:mt-2 text-center sm:max-w-[120px]">
                {grade.summary}
              </p>
            </div>

            {/* Indicator grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
              {indicators.map((ind) => {
                const style = RATING_STYLES[ind.rating]
                return (
                  <div
                    key={ind.label}
                    className="rounded-lg border border-border/50 px-3 py-2.5 flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: style.dot }}
                      />
                      <span className="text-[11px] text-muted-foreground truncate">
                        {ind.label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {ind.value}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      {ind.detail}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
