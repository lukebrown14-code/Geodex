"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { useApiData } from "@/hooks/useApiData";
import { PopulationRecord, PyramidData } from "@/types/population";

export function PopulationPyramid({ location }: { location: string }) {
  const params = useMemo(
    () => (location ? { location } : undefined),
    [location],
  );
  const { data: raw, loading, error } = useApiData<PopulationRecord>("/api/population", params);

  const data: PyramidData[] = useMemo(
    () =>
      raw
        .map((record) => ({
          age: record.AgeGrp,
          male: -Math.abs(record.PopMale),
          female: Math.abs(record.PopFemale),
        }))
        .reverse(),
    [raw],
  );

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Population Pyramid – {location}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        <div className="h-125 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 40, left: 40, bottom: 10 }}
              stackOffset="sign"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />

              <XAxis
                type="number"
                tickFormatter={(value) =>
                  Math.abs(value).toLocaleString()
                }
                domain={["dataMin", "dataMax"]}
              />

              <YAxis
                type="category"
                dataKey="age"
                axisLine={false}
                tickLine={false}
                width={60}
                fontSize={13}
              />

              <Tooltip
                formatter={(value: number) =>
                  Math.abs(value).toLocaleString()
                }
              />

              <Bar
                dataKey="male"
                fill="#3b82f6"
                radius={[4, 0, 0, 4]}
                name="Male"
              />
              <Bar
                dataKey="female"
                fill="#ec4899"
                radius={[0, 4, 4, 0]}
                name="Female"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span>Male</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-pink-500" />
            <span>Female</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
