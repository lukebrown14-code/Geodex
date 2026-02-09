"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { AgeDistribution } from "@/types/country";

interface Props {
  data: AgeDistribution[];
}

export default function PopulationPyramid({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 12, right: 16, bottom: 24, left: 16 };
    const midGap = 40;
    const chartWidth = (width - margin.left - margin.right - midGap) / 2;
    const chartHeight = height - margin.top - margin.bottom;

    const maxVal = d3.max(data, (d) => Math.max(d.male, d.female)) || 15;

    const xScale = d3.scaleLinear().domain([0, maxVal]).range([0, chartWidth]);
    const yScale = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.group))
      .range([chartHeight, 0])
      .padding(0.15);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll(".bar-male")
      .data(data)
      .join("rect")
      .attr("class", "bar-male")
      .attr("x", (d) => chartWidth - xScale(d.male))
      .attr("y", (d) => yScale(d.group)!)
      .attr("width", (d) => xScale(d.male))
      .attr("height", yScale.bandwidth())
      .attr("fill", "#3b82f6")
      .attr("rx", 2);

    g.selectAll(".bar-female")
      .data(data)
      .join("rect")
      .attr("class", "bar-female")
      .attr("x", chartWidth + midGap)
      .attr("y", (d) => yScale(d.group)!)
      .attr("width", (d) => xScale(d.female))
      .attr("height", yScale.bandwidth())
      .attr("fill", "#22c55e")
      .attr("rx", 2);

    g.selectAll(".label")
      .data(data)
      .join("text")
      .attr("x", chartWidth + midGap / 2)
      .attr("y", (d) => yScale(d.group)! + yScale.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "rgba(255,255,255,0.5)")
      .attr("font-size", "10px")
      .attr("font-family", "'Lora', serif")
      .text((d) => d.group);

    const legend = g
      .append("g")
      .attr("transform", `translate(${chartWidth - 60}, ${-2})`);
    legend.append("rect").attr("width", 8).attr("height", 8).attr("fill", "#3b82f6").attr("rx", 1);
    legend.append("text").attr("x", 12).attr("y", 8).attr("fill", "rgba(255,255,255,0.5)").attr("font-size", "9px").text("Male");
    legend.append("rect").attr("x", 44).attr("width", 8).attr("height", 8).attr("fill", "#22c55e").attr("rx", 1);
    legend.append("text").attr("x", 56).attr("y", 8).attr("fill", "rgba(255,255,255,0.5)").attr("font-size", "9px").text("Female");
  }, [data]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      role="img"
      aria-label="Population pyramid showing age and gender distribution"
    />
  );
}
