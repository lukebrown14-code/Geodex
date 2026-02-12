import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type IndicatorResult, type Grade, RATING_STYLES } from "@/lib/scoring"

interface ScoreCardProps {
  title: string
  indicators: IndicatorResult[]
  grade: Grade
  loading?: boolean
  error?: string | null
}

export function ScoreCard({ title, indicators, grade, loading, error }: ScoreCardProps) {
  return (
    <Card className="h-full col-span-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div className="animate-pulse bg-muted rounded h-[140px]" />}
        {error && <p className="text-red-500">Error: {error}</p>}
        {indicators.length > 0 && (
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
