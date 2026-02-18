"use client"

import { useMemo } from "react"
import { useApiData } from "@/hooks/useApiData"
import { MedianData, PopulationRecord } from "@/types/demographics"
import { type IndicatorResult, type Rating, computeGrade } from "@/lib/scoring"
import { ScoreCard } from "@/components/charts/ScoreCard"
import useLocationStore from "@/lib/store"

/* ── Domain-specific rating functions ── */

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

function computeDemoGrade(demoData: MedianData[], popData: PopulationRecord[]) {
  if (demoData.length === 0) return null

  const sorted = [...demoData]
    .filter((d) => d.LEx != null)
    .sort((a, b) => b.Time - a.Time)
  const latest = sorted[0]
  if (!latest) return null

  let working = 0
  let dependent = 0
  for (const r of popData) {
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
}

/* ── Component ── */

export function DemographicScoreCard({ location }: { location: string }) {
  const comparisonCountry = useLocationStore((s) => s.comparisonCountry)

  const params = useMemo(() => ({ location }), [location])
  const demo = useApiData<MedianData>("/api/demographics", params)
  const pop = useApiData<PopulationRecord>("/api/population", params)

  const compParams = useMemo(
    () => (comparisonCountry ? { location: comparisonCountry } : undefined),
    [comparisonCountry],
  )
  const compDemo = useApiData<MedianData>("/api/demographics", compParams)
  const compPop = useApiData<PopulationRecord>("/api/population", compParams)

  const loading = demo.loading || pop.loading
  const error = demo.error || pop.error

  const result = useMemo(
    () => computeDemoGrade(demo.data, pop.data),
    [demo.data, pop.data],
  )

  const compResult = useMemo(
    () => (comparisonCountry ? computeDemoGrade(compDemo.data, compPop.data) : null),
    [comparisonCountry, compDemo.data, compPop.data],
  )

  const emptyGrade = { letter: "", color: "", bgColor: "", summary: "" }

  if (!result?.grade) {
    return (
      <ScoreCard
        title={`Demographic Health Score — ${location}`}
        indicators={[]}
        grade={emptyGrade}
        loading={loading}
        error={error}
        info="Overall demographic health grade based on life expectancy, infant mortality, fertility, age structure, growth, and dependency."
      />
    )
  }

  return (
    <ScoreCard
      title={`Demographic Health Score — ${location}`}
      indicators={result.indicators}
      grade={result.grade}
      loading={loading}
      error={error}
      info="Overall demographic health grade based on life expectancy, infant mortality, fertility, age structure, growth, and dependency."
      comparisonGrade={compResult?.grade}
      comparisonIndicators={compResult?.indicators}
      comparisonLabel={comparisonCountry ?? undefined}
      primaryLabel={location}
    />
  )
}
