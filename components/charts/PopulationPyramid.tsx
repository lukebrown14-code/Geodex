"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/charts/ChartCard";
import { PopulationRecord, PyramidData } from "@/types/population";

export function PopulationPyramid({ location }: { location: string }) {
  return (
    <ChartCard<PopulationRecord>
      endpoint="/api/population"
      title={`Population Pyramid – ${location}`}
      location={location}
      className="w-full"
    >
      {(raw) => <PyramidContent raw={raw} />}
    </ChartCard>
  );
}

function PyramidContent({ raw }: { raw: PopulationRecord[] }) {
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
    <>
      <div className="h-96 w-full">
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

              domain={([dataMin, dataMax]: [number, number]) => {
                const padding = (dataMax - dataMin) * 0.1 || 1
                return [Math.floor(dataMin - padding), Math.ceil(dataMax + padding)]
              }}
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
              fill="var(--chart-1)"
              radius={[4, 0, 0, 4]}
              name="Male"
            />
            <Bar
              dataKey="female"
              fill="var(--chart-3)"
              radius={[0, 4, 4, 0]}
              name="Female"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ background: "var(--chart-1)" }} />
          <span>Male</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ background: "var(--chart-3)" }} />
          <span>Female</span>
        </div>
      </div>
    </>
  );
}
