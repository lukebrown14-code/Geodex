export type Rating = "healthy" | "warning" | "unhealthy"

export interface IndicatorResult {
  label: string
  value: string
  rating: Rating
  detail: string
}

export interface Grade {
  letter: string
  color: string
  bgColor: string
  summary: string
}

export function computeGrade(indicators: IndicatorResult[]): Grade {
  const scores = indicators.map((i) =>
    i.rating === "healthy" ? 3 : i.rating === "warning" ? 2 : 1
  )
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length

  if (avg >= 2.7) return { letter: "A", color: "#22c55e", bgColor: "rgba(34,197,94,0.1)", summary: "Strong overall health" }
  if (avg >= 2.3) return { letter: "B", color: "#84cc16", bgColor: "rgba(132,204,22,0.1)", summary: "Good with minor concerns" }
  if (avg >= 1.8) return { letter: "C", color: "#eab308", bgColor: "rgba(234,179,8,0.1)", summary: "Mixed signals" }
  if (avg >= 1.4) return { letter: "D", color: "#f97316", bgColor: "rgba(249,115,22,0.1)", summary: "Several areas of concern" }
  return { letter: "F", color: "#ef4444", bgColor: "rgba(239,68,68,0.1)", summary: "Critical challenges" }
}

export const RATING_STYLES: Record<Rating, { dot: string }> = {
  healthy:   { dot: "#22c55e" },
  warning:   { dot: "#eab308" },
  unhealthy: { dot: "#ef4444" },
}
