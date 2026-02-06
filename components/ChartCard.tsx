"use client";

import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  className?: string;
  accent?: "blue" | "green";
}

export default function ChartCard({
  title,
  children,
  className = "",
  accent = "blue",
}: Props) {
  const borderColor =
    accent === "blue"
      ? "border-blue-500/20 hover:border-blue-500/40"
      : "border-green-500/20 hover:border-green-500/40";

  return (
    <div
      className={`flex flex-col border ${borderColor} bg-white/[0.02] p-4 transition-colors duration-300 ${className}`}
    >
      <h3 className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.15em] text-white/50">
        {title}
      </h3>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
