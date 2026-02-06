"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { GDPDataPoint } from "@/types/country";

interface Props {
  data: GDPDataPoint[];
}

export default function GDPChart({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 8, right: 12, bottom: 28, left: 48 };
    const chartW = width - margin.left - margin.right;
    const chartH = height - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year) as [number, number])
      .range([0, chartW]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)! * 1.1])
      .range([chartH, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Gradient fill
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "gdp-gradient")
      .attr("x1", "0")
      .attr("y1", "0")
      .attr("x2", "0")
      .attr("y2", "1");
    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#22c55e")
      .attr("stop-opacity", 0.3);
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#22c55e")
      .attr("stop-opacity", 0.0);

    // Area
    const area = d3
      .area<GDPDataPoint>()
      .x((d) => x(d.year))
      .y0(chartH)
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    g.append("path").datum(data).attr("d", area).attr("fill", "url(#gdp-gradient)");

    // Line
    const line = d3
      .line<GDPDataPoint>()
      .x((d) => x(d.year))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "#22c55e")
      .attr("stroke-width", 2.5);

    // Data points
    g.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.year))
      .attr("cy", (d) => y(d.value))
      .attr("r", 3)
      .attr("fill", "#0a0a0a")
      .attr("stroke", "#22c55e")
      .attr("stroke-width", 1.5);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${chartH})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat((d) => String(d)),
      )
      .call((g) => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .call((g) =>
        g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.1)"),
      )
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "rgba(255,255,255,0.4)")
          .attr("font-size", "10px"),
      );

    // Y axis
    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(4)
          .tickFormat((d) => `$${Number(d) >= 1000 ? (Number(d) / 1000).toFixed(0) + "T" : d + "B"}`),
      )
      .call((g) => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .call((g) =>
        g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.1)"),
      )
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "rgba(255,255,255,0.4)")
          .attr("font-size", "10px"),
      );

    // Grid lines
    g.append("g")
      .call(d3.axisLeft(y).ticks(4).tickSize(-chartW).tickFormat(() => ""))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.04)"),
      );
  }, [data]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      role="img"
      aria-label="GDP trend chart over time"
    />
  );
}
