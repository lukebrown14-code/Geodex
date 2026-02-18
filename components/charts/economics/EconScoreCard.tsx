"use client"

import { useMemo } from "react"
import { useApiData } from "@/hooks/useApiData"
import { EconomicData } from "@/types/economics"
import { type IndicatorResult, type Rating, computeGrade } from "@/lib/scoring"
import { ScoreCard } from "@/components/charts/ScoreCard"
import useLocationStore from "@/lib/store"

/* ── Domain-specific rating functions ── */

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

function computeEconGrade(data: EconomicData[]) {
  if (data.length === 0) return null

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

  if (indicators.length === 0) return null

  return { indicators, grade: computeGrade(indicators) }
}

/* ── Component ── */

export function EconScoreCard({ location }: { location: string }) {
  const comparisonCountry = useLocationStore((s) => s.comparisonCountry)

  const params = useMemo(() => ({ location }), [location])
  const { data, loading, error } = useApiData<EconomicData>("/api/economics", params)

  const compParams = useMemo(
    () => (comparisonCountry ? { location: comparisonCountry } : undefined),
    [comparisonCountry],
  )
  const { data: compData } = useApiData<EconomicData>("/api/economics", compParams)

  const result = useMemo(() => computeEconGrade(data), [data])
  const compResult = useMemo(
    () => (comparisonCountry ? computeEconGrade(compData) : null),
    [comparisonCountry, compData],
  )

  const emptyGrade = { letter: "", color: "", bgColor: "", summary: "" }

  if (!result?.grade) {
    return (
      <ScoreCard
        title={`Economic Health Score — ${location}`}
        indicators={[]}
        grade={emptyGrade}
        loading={loading}
        error={error}
        info="Overall economic health grade based on GDP growth, income level, inflation, unemployment, debt, and trade balance."
      />
    )
  }

  return (
    <ScoreCard
      title={`Economic Health Score — ${location}`}
      indicators={result.indicators}
      grade={result.grade}
      loading={loading}
      error={error}
      info="Overall economic health grade based on GDP growth, income level, inflation, unemployment, debt, and trade balance."
      comparisonGrade={compResult?.grade}
      comparisonIndicators={compResult?.indicators}
      comparisonLabel={comparisonCountry ?? undefined}
      primaryLabel={location}
    />
  )
}
