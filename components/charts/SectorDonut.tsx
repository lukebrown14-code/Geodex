"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Props {
  data: { name: string; percentage: number }[];
}

const COLORS = ["#3b82f6", "#22c55e", "#a78bfa", "#f59e0b"];

export default function SectorDonut({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const radius = Math.min(width, height) / 2 - 8;
    const innerRadius = radius * 0.6;

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3
      .pie<{ name: string; percentage: number }>()
      .value((d) => d.percentage)
      .sort(null)
      .padAngle(0.03);

    const arc = d3
      .arc<d3.PieArcDatum<{ name: string; percentage: number }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(3);

    g.selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("d", arc)
      .attr("fill", (_, i) => COLORS[i % COLORS.length])
      .attr("stroke", "#0a0a0a")
      .attr("stroke-width", 2);

    // Legend below donut
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width / 2 - 60}, ${height / 2 + radius - 4})`);

    data.forEach((d, i) => {
      if (i > 3) return;
      const row = legend
        .append("g")
        .attr("transform", `translate(${(i % 2) * 65}, ${Math.floor(i / 2) * 14})`);
      row
        .append("rect")
        .attr("width", 6)
        .attr("height", 6)
        .attr("fill", COLORS[i % COLORS.length])
        .attr("rx", 1);
      row
        .append("text")
        .attr("x", 10)
        .attr("y", 6)
        .attr("fill", "rgba(255,255,255,0.5)")
        .attr("font-size", "8px")
        .text(`${d.name}`);
    });
  }, [data]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      role="img"
      aria-label="Economic sectors donut chart"
    />
  );
}
