"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { type IndicatorResult, type Grade, RATING_STYLES } from "@/lib/scoring"

interface ScoreCardProps {
  title: string
  indicators: IndicatorResult[]
  grade: Grade
  loading?: boolean
  error?: string | null
  info?: string
  comparisonGrade?: Grade | null
  comparisonIndicators?: IndicatorResult[] | null
  comparisonLabel?: string
  primaryLabel?: string
}

export function ScoreCard({ title, indicators, grade, loading, error, info, comparisonGrade, comparisonIndicators, comparisonLabel, primaryLabel }: ScoreCardProps) {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <Card className="h-full col-span-full">
      <CardHeader>
        <CardTitle className="font-mono text-xs tracking-wider uppercase">{title}</CardTitle>
        {info && (
          <CardAction>
            <Tooltip open={infoOpen} onOpenChange={setInfoOpen}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Score info"
                  onClick={() => setInfoOpen((prev) => !prev)}
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64 text-pretty">
                <p>{info}</p>
              </TooltipContent>
            </Tooltip>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="animate-pulse flex gap-4 sm:gap-6 flex-col sm:flex-row h-[140px]">
            {/* Grade circle placeholder */}
            <div className="flex sm:flex-col items-center sm:justify-center gap-3 sm:gap-2 shrink-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-muted" />
              <div className="h-2 w-16 rounded bg-muted" />
            </div>
            {/* Indicator grid placeholders */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border/30 px-3 py-2.5 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-muted" />
                    <div className="h-2 w-12 rounded bg-muted" />
                  </div>
                  <div className="h-4 w-16 rounded bg-muted" />
                  <div className="h-2 w-20 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        )}
        {error && <p className="text-red-500">Error: {error}</p>}
        {indicators.length > 0 && (
          <div className="flex gap-4 sm:gap-6 flex-col sm:flex-row">
            {/* Grade circle(s) */}
            <div className="flex sm:flex-col items-center sm:justify-center gap-3 shrink-0">
              {/* Primary grade */}
              <div className="flex flex-col items-center">
                <div
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl flex items-center justify-center border-2"
                  style={{ borderColor: grade.color, backgroundColor: grade.bgColor }}
                >
                  <span
                    className="font-mono text-4xl sm:text-5xl font-black tracking-tighter"
                    style={{ color: grade.color }}
                  >
                    {grade.letter}
                  </span>
                </div>
                {comparisonGrade ? (
                  <p className="font-mono text-[10px] text-muted-foreground mt-1 text-center">
                    {primaryLabel}
                  </p>
                ) : (
                  <p className="font-mono text-[10px] text-muted-foreground sm:mt-2 text-center sm:max-w-[120px]">
                    {grade.summary}
                  </p>
                )}
              </div>

              {/* Comparison grade */}
              {comparisonGrade && (
                <div className="flex flex-col items-center">
                  <div
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl flex items-center justify-center border-2 border-dashed"
                    style={{ borderColor: comparisonGrade.color, backgroundColor: comparisonGrade.bgColor }}
                  >
                    <span
                      className="font-mono text-4xl sm:text-5xl font-black tracking-tighter"
                      style={{ color: comparisonGrade.color }}
                    >
                      {comparisonGrade.letter}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-chart-2 mt-1 text-center">
                    {comparisonLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Indicator grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
              {indicators.map((ind) => {
                const style = RATING_STYLES[ind.rating]
                const compInd = comparisonIndicators?.find((c) => c.label === ind.label)
                const compStyle = compInd ? RATING_STYLES[compInd.rating] : null
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
                      <span className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground truncate">
                        {ind.label}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {ind.value}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      {ind.detail}
                    </span>

                    {/* Comparison country value */}
                    {compInd && compStyle && (
                      <div className="mt-1 pt-1.5 border-t border-dashed border-border/50">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="h-1.5 w-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: compStyle.dot }}
                          />
                          <span className="font-mono text-[10px] text-chart-2/70 truncate">
                            {comparisonLabel}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-semibold text-foreground/70">
                          {compInd.value}
                        </span>
                        <p className="text-[10px] text-muted-foreground/60 leading-tight">
                          {compInd.detail}
                        </p>
                      </div>
                    )}
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
