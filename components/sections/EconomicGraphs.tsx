import { EconLineChart } from "@/components/charts/economics/EconLineChart";
import { EconScoreCard } from "@/components/charts/economics/EconScoreCard";
import { EconAreaChart } from "@/components/charts/economics/EconAreaChart";
import { EconBarChart } from "@/components/charts/economics/EconBarChart";
import { EconMetricBarChart } from "@/components/charts/economics/EconMetricBarChart";

export function EconomicGraphs({
  searchedLocation,
}: {
  searchedLocation: string;
}) {
  return (
    <>
      {/* Row 1: Score Card */}
      <div className="col-span-full animate-fade-in-up" style={{ animationDelay: "0ms" }}>
        <EconScoreCard location={searchedLocation} />
      </div>

      {/* Row 2: GDP headline */}
      <div className="col-span-full animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <EconLineChart location={searchedLocation} type="GDP" />
      </div>

      {/* Row 3: GDP Growth | GDP per Capita */}
      <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <EconMetricBarChart location={searchedLocation} type="GDP Growth" />
      </div>
      <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
        <EconLineChart location={searchedLocation} type="GDP per Capita" />
      </div>

      {/* Row 4: Inflation | Unemployment */}
      <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        <EconLineChart location={searchedLocation} type="Inflation" />
      </div>
      <div className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
        <EconLineChart location={searchedLocation} type="Unemployment" />
      </div>

      {/* Row 5: Section header */}
      <div className="col-span-full animate-fade-in-up" style={{ animationDelay: "600ms" }}>
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
          Fiscal &amp; Trade
        </h3>
      </div>

      {/* Row 6: Revenue vs Expense | Public Debt */}
      <div className="animate-fade-in-up" style={{ animationDelay: "700ms" }}>
        <EconAreaChart location={searchedLocation} />
      </div>
      <div className="animate-fade-in-up" style={{ animationDelay: "800ms" }}>
        <EconMetricBarChart location={searchedLocation} type="Public Debt" />
      </div>

      {/* Row 7: Current Account Balance */}
      <div className="col-span-full animate-fade-in-up" style={{ animationDelay: "900ms" }}>
        <div className="max-w-3xl mx-auto">
          <EconBarChart location={searchedLocation} />
        </div>
      </div>
    </>
  );
}
