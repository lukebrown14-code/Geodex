"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { PopulationRecord } from "@/types/population";

interface Props {
  data: PopulationRecord[];
}

const chartConfig = {
  PopMale: {
    label: "Male",
    color: "#3b82f6",
  },
  PopFemale: {
    label: "Female",
    color: "#ec4899",
  },
} satisfies ChartConfig;

export function SexBarChart({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Population by Sex (Stacked)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-100 w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="Time"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="PopMale"
              stackId="pop"
              fill="var(--color-PopMale)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="PopFemale"
              stackId="pop"
              fill="var(--color-PopFemale)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
