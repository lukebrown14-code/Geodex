"use client"

import { useMemo, type ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApiData } from "@/hooks/useApiData"

interface ChartCardProps<T> {
  endpoint: string
  title: string
  location: string
  className?: string
  children: (data: T[]) => ReactNode
}

export function ChartCard<T>({ endpoint, title, location, className, children }: ChartCardProps<T>) {
  const params = useMemo(
    () => (location ? { location } : undefined),
    [location],
  )
  const { data, loading, error } = useApiData<T>(endpoint, params)

  return (
    <Card className={`h-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {children(data)}
      </CardContent>
    </Card>
  )
}
