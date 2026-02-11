"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApiData } from "@/hooks/useApiData"
import { MedianData, PopulationRecord } from "@/types/population"

/* ── Scoring helpers ── */

type Rating = "healthy" | "warning" | "unhealthy"

interface IndicatorResult {
  label: string
  value: string
  rating: Rating
  detail: string
}

function rateLifeExpectancy(lex: number): IndicatorResult {
  const rating: Rating = lex >= 75 ? "healthy" : lex >= 65 ? "warning" : "unhealthy"
  return {
    label: "Life Expectancy",
    value: `${lex.toFixed(1)} yrs`,
    rating,
    detail: lex >= 75 ? "Strong healthcare outcomes" : lex >= 65 ? "Below global average" : "Significant health challenges",
  }
}

function rateInfantMortality(im: number): IndicatorResult {
  const rating: Rating = im < 10 ? "healthy" : im < 30 ? "warning" : "unhealthy"
  return {
    label: "Infant Mortality",
    value: `${im.toFixed(1)} per 1k`,
    rating,
    detail: im < 10 ? "Low infant mortality" : im < 30 ? "Moderate infant mortality" : "High infant mortality",
  }
}

function rateTFR(tfr: number): IndicatorResult {
  const rating: Rating =
    tfr >= 1.8 && tfr <= 2.5 ? "healthy" :
    (tfr >= 1.3 && tfr < 1.8) || (tfr > 2.5 && tfr <= 4.0) ? "warning" :
    "unhealthy"
  return {
    label: "Fertility Rate",
    value: `${tfr.toFixed(2)} TFR`,
    rating,
    detail:
      tfr < 1.3 ? "Population decline risk" :
      tfr < 1.8 ? "Below replacement level" :
      tfr <= 2.5 ? "Near replacement level" :
      tfr <= 4.0 ? "Above replacement level" :
      "Unsustainable growth pressure",
  }
}

function rateMedianAge(age: number): IndicatorResult {
  const rating: Rating =
    age >= 25 && age <= 38 ? "healthy" :
    (age >= 20 && age < 25) || (age > 38 && age <= 45) ? "warning" :
    "unhealthy"
  return {
    label: "Median Age",
    value: `${age.toFixed(1)} yrs`,
    rating,
    detail:
      age < 20 ? "Very young — high youth dependency" :
      age < 25 ? "Young population" :
      age <= 38 ? "Balanced age structure" :
      age <= 45 ? "Aging population" :
      "Severe aging — shrinking workforce",
  }
}

function rateNaturalGrowth(cbr: number, cdr: number): IndicatorResult {
  const growth = cbr - cdr
  const rating: Rating =
    growth >= 2 && growth <= 15 ? "healthy" :
    (growth >= 0 && growth < 2) || (growth > 15 && growth <= 25) ? "warning" :
    "unhealthy"
  return {
    label: "Natural Growth",
    value: `${growth > 0 ? "+" : ""}${growth.toFixed(1)} per 1k`,
    rating,
    detail:
      growth < 0 ? "Population shrinking naturally" :
      growth < 2 ? "Near-zero growth" :
      growth <= 15 ? "Sustainable growth rate" :
      growth <= 25 ? "Rapid growth" :
      "Very rapid population growth",
  }
}

function rateDependency(working: number, dependent: number): IndicatorResult {
  const ratio = working > 0 ? (dependent / working) * 100 : 0
  const rating: Rating = ratio < 60 ? "healthy" : ratio < 80 ? "warning" : "unhealthy"
  return {
    label: "Dependency Ratio",
    value: `${ratio.toFixed(0)}%`,
    rating,
    detail:
      ratio < 60 ? "Low burden on workforce" :
      ratio < 80 ? "Moderate dependency burden" :
      "High dependency — workforce strain",
  }
}

/* ── Compute overall grade ── */

function computeGrade(indicators: IndicatorResult[]): { letter: string; color: string; bgColor: string; summary: string } {
  const scores = indicators.map((i) =>
    i.rating === "healthy" ? 3 : i.rating === "warning" ? 2 : 1
  )
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length

  if (avg >= 2.7) return { letter: "A", color: "#22c55e", bgColor: "rgba(34,197,94,0.1)", summary: "Strong demographic health" }
  if (avg >= 2.3) return { letter: "B", color: "#84cc16", bgColor: "rgba(132,204,22,0.1)", summary: "Good with minor concerns" }
  if (avg >= 1.8) return { letter: "C", color: "#eab308", bgColor: "rgba(234,179,8,0.1)", summary: "Mixed demographic signals" }
  if (avg >= 1.4) return { letter: "D", color: "#f97316", bgColor: "rgba(249,115,22,0.1)", summary: "Several areas of concern" }
  return { letter: "F", color: "#ef4444", bgColor: "rgba(239,68,68,0.1)", summary: "Critical demographic challenges" }
}

/* ── Rating colors ── */

const RATING_STYLES: Record<Rating, { dot: string; text: string }> = {
  healthy:   { dot: "#22c55e", text: "text-green-500" },
  warning:   { dot: "#eab308", text: "text-yellow-500" },
  unhealthy: { dot: "#ef4444", text: "text-red-500" },
}

/* ── Component ── */

export function DemographicScoreCard({ location }: { location: string }) {
  const params = useMemo(() => ({ location }), [location])
  const demo = useApiData<MedianData>("/api/demographics", params)
  const pop = useApiData<PopulationRecord>("/api/population", params)

  const loading = demo.loading || pop.loading
  const error = demo.error || pop.error

  const { indicators, grade } = useMemo(() => {
    if (demo.data.length === 0) return { indicators: [], grade: null }

    // Get most recent year
    const sorted = [...demo.data]
      .filter((d) => d.LEx != null)
      .sort((a, b) => b.Time - a.Time)
    const latest = sorted[0]
    if (!latest) return { indicators: [], grade: null }

    // Dependency ratio from population data
    let working = 0
    let dependent = 0
    for (const r of pop.data) {
      const p = r.PopMale + r.PopFemale
      if (r.AgeGrp === "100+") { dependent += p; continue }
      const age = Number(r.AgeGrp.split("-")[0])
      if (age <= 15 || age >= 60) dependent += p
      else working += p
    }

    const indicators = [
      rateLifeExpectancy(Number(latest.LEx)),
      rateInfantMortality(Number(latest.InfantDeaths)),
      rateTFR(Number(latest.TFR)),
      rateMedianAge(Number(latest.MedianAgePop)),
      rateNaturalGrowth(Number(latest.CBR), Number(latest.CDR)),
      ...(working > 0 ? [rateDependency(working, dependent)] : []),
    ]

    return { indicators, grade: computeGrade(indicators) }
  }, [demo.data, pop.data])

  return (
    <Card className="h-full col-span-full">
      <CardHeader>
        <CardTitle>Demographic Health Score — {location}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div className="animate-pulse bg-muted rounded h-[140px]" />}
        {error && <p className="text-red-500">Error: {error}</p>}
        {grade && indicators.length > 0 && (
          <div className="flex gap-6 flex-col sm:flex-row">
            {/* Grade circle */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div
                className="h-24 w-24 rounded-2xl flex items-center justify-center border-2"
                style={{ borderColor: grade.color, backgroundColor: grade.bgColor }}
              >
                <span
                  className="text-5xl font-black tracking-tighter"
                  style={{ color: grade.color }}
                >
                  {grade.letter}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center max-w-[120px]">
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
