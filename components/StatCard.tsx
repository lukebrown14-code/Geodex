"use client";

interface Props {
  label: string;
  value: string;
  change?: number;
  suffix?: string;
  accent?: "blue" | "green";
}

export default function StatCard({
  label,
  value,
  change,
  suffix,
  accent = "blue",
}: Props) {
  const accentColor =
    accent === "blue" ? "text-blue-500" : "text-green-500";
  const borderColor =
    accent === "blue"
      ? "border-blue-500/20 hover:border-blue-500/40"
      : "border-green-500/20 hover:border-green-500/40";

  return (
    <div
      className={`border ${borderColor} bg-white/[0.02] p-4 transition-colors duration-300`}
    >
      <p className="font-body text-[11px] uppercase tracking-[0.15em] text-white/40">
        {label}
      </p>
      <p className={`mt-1 font-heading text-2xl font-bold ${accentColor}`}>
        {value}
        {suffix && (
          <span className="ml-1 text-sm font-normal text-white/30">
            {suffix}
          </span>
        )}
      </p>
      {change !== undefined && (
        <p
          className={`mt-1 font-body text-xs ${change >= 0 ? "text-green-400" : "text-red-400"}`}
        >
          {change >= 0 ? "+" : ""}
          {change}%
        </p>
      )}
    </div>
  );
}
