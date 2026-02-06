"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { PopulationDataPoint } from "@/types/country";

interface Props {
  data: PopulationDataPoint[];
}

export default function PopulationChart({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 8, right: 12, bottom: 28, left: 54 };
    const chartW = width - margin.left - margin.right;
    const chartH = height - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year) as [number, number])
      .range([0, chartW]);

    const yMin = d3.min(data, (d) => d.population)! * 0.97;
    const yMax = d3.max(data, (d) => d.population)! * 1.03;
    const y = d3.scaleLinear().domain([yMin, yMax]).range([chartH, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "pop-gradient")
      .attr("x1", "0")
      .attr("y1", "0")
      .attr("x2", "0")
      .attr("y2", "1");
    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3b82f6")
      .attr("stop-opacity", 0.25);
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#3b82f6")
      .attr("stop-opacity", 0.0);

    const area = d3
      .area<PopulationDataPoint>()
      .x((d) => x(d.year))
      .y0(chartH)
      .y1((d) => y(d.population))
      .curve(d3.curveMonotoneX);

    g.append("path").datum(data).attr("d", area).attr("fill", "url(#pop-gradient)");

    const line = d3
      .line<PopulationDataPoint>()
      .x((d) => x(d.year))
      .y((d) => y(d.population))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2.5);

    g.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.year))
      .attr("cy", (d) => y(d.population))
      .attr("r", 3)
      .attr("fill", "#0a0a0a")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 1.5);

    g.append("g")
      .attr("transform", `translate(0,${chartH})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat((d) => String(d)),
      )
      .call((g) => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.1)"))
      .call((g) => g.selectAll(".tick text").attr("fill", "rgba(255,255,255,0.4)").attr("font-size", "10px"));

    const formatPop = (d: d3.NumberValue) => {
      const n = Number(d);
      if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
      if (n >= 1e6) return (n / 1e6).toFixed(0) + "M";
      return (n / 1e3).toFixed(0) + "K";
    };

    g.append("g")
      .call(d3.axisLeft(y).ticks(4).tickFormat(formatPop))
      .call((g) => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.1)"))
      .call((g) => g.selectAll(".tick text").attr("fill", "rgba(255,255,255,0.4)").attr("font-size", "10px"));

    g.append("g")
      .call(d3.axisLeft(y).ticks(4).tickSize(-chartW).tickFormat(() => ""))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.04)"));
  }, [data]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      role="img"
      aria-label="Population trend chart over time"
    />
  );
}
