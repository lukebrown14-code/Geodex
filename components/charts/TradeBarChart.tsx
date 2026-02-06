"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { TradeBalance } from "@/types/country";

interface Props {
  data: TradeBalance;
}

export default function TradeBarChart({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 16, right: 12, bottom: 24, left: 12 };
    const chartW = width - margin.left - margin.right;
    const chartH = height - margin.top - margin.bottom;

    const categories = ["Exports", "Imports"];
    const values = [data.exports, data.imports];
    const colors = ["#22c55e", "#3b82f6"];

    const x = d3.scaleBand().domain(categories).range([0, chartW]).padding(0.4);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(values)! * 1.15])
      .range([chartH, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll("rect")
      .data(values)
      .join("rect")
      .attr("x", (_, i) => x(categories[i])!)
      .attr("y", (d) => y(d))
      .attr("width", x.bandwidth())
      .attr("height", (d) => chartH - y(d))
      .attr("fill", (_, i) => colors[i])
      .attr("rx", 3);

    // Value labels
    g.selectAll(".val-label")
      .data(values)
      .join("text")
      .attr("x", (_, i) => x(categories[i])! + x.bandwidth() / 2)
      .attr("y", (d) => y(d) - 6)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.7)")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .text((d) => `$${d}B`);

    // Category labels
    g.selectAll(".cat-label")
      .data(categories)
      .join("text")
      .attr("x", (d) => x(d)! + x.bandwidth() / 2)
      .attr("y", chartH + 16)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.4)")
      .attr("font-size", "10px")
      .text((d) => d);
  }, [data]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      role="img"
      aria-label="Trade balance bar chart showing exports and imports"
    />
  );
}
