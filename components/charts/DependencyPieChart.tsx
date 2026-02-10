"use client"

import { useMemo } from "react"
import { useApiData } from "@/hooks/useApiData";
import { PopulationRecord, PyramidData } from "@/types/population";

export function DependencyPieChart({ location }: { location: string }) {
  const params = useMemo(
    () => (location ? { location } : undefined),
    [location],
  )

  const { data: raw, loading, error } = useApiData<PopulationRecord>("/api/population", params);

  const data: PyramidData[] = useMemo(
    () =>
      raw.map((record) => ({
        age: record.AgeGrp,
        male: -Math.abs(record.PopMale),
        female: Math.abs(record.PopFemale),
      })),
    [raw],
  )

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
