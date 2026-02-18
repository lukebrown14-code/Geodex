"use client";

import { Globe, X } from "lucide-react";
import useLocationStore from "@/lib/store";

export function CountryTabs() {
  const {
    openCountries,
    activeCountry,
    comparisonCountry,
    setActiveCountry,
    removeCountry,
    setComparisonCountry,
    clearComparison,
  } = useLocationStore();

  if (openCountries.length === 0) return null;

  const hasMultipleTabs = openCountries.length > 1;

  return (
    <div className="scrollbar-hide overflow-x-auto space-y-2">
      <div className="inline-flex w-full sm:w-auto bg-muted/50 border border-border/50 rounded-xl p-1 gap-1">
        {openCountries.map((country) => {
          const isActive = activeCountry === country;
          const isComparison = comparisonCountry === country;
          return (
            <button
              key={country}
              onClick={() => setActiveCountry(country)}
              className={`group relative flex items-center gap-2 px-3 py-2 font-mono text-xs tracking-wider uppercase rounded-lg cursor-pointer transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? "bg-background shadow-sm border-b-2 border-chart-1 text-foreground"
                  : isComparison
                    ? "bg-background/50 shadow-sm border-b-2 border-dashed border-chart-2 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="h-3.5 w-3.5 shrink-0" />
              {isActive && (
                <span className="text-chart-1/40 select-none">//</span>
              )}
              {isComparison && (
                <span className="text-chart-2/40 select-none">vs</span>
              )}
              {country}

              {/* VS pill — always visible on inactive, non-comparison tabs */}
              {!isActive && !isComparison && hasMultipleTabs && (
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setComparisonCountry(country);
                  }}
                  title={`Compare with ${country}`}
                  className="ml-0.5 px-1.5 py-0.5 rounded-full bg-chart-2/15 text-chart-2 font-mono text-[10px] font-semibold tracking-widest leading-none opacity-70 hover:opacity-100 hover:bg-chart-2/25 transition-all"
                >
                  VS
                </span>
              )}

              {/* Clear comparison button on comparison tab */}
              {isComparison && (
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearComparison();
                  }}
                  title="Clear comparison"
                  className="ml-0.5 p-0.5 rounded hover:bg-destructive/20 hover:text-destructive transition-colors opacity-60 hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </span>
              )}

              {/* Close tab button */}
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCountry(country);
                }}
                className={`ml-1 p-0.5 rounded hover:bg-destructive/20 hover:text-destructive transition-colors ${
                  isActive || isComparison
                    ? "opacity-60 hover:opacity-100"
                    : "opacity-0 group-hover:opacity-60 hover:!opacity-100 sm:opacity-0 max-sm:opacity-60"
                }`}
              >
                <X className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Hint bar — visible when 2+ tabs open and no comparison active */}
      {hasMultipleTabs && !comparisonCountry && (
        <div className="font-mono text-[11px] tracking-wider uppercase text-muted-foreground/50 px-1 select-none">
          // click <span className="text-chart-2/70">VS</span> on any tab to
          compare with{" "}
          <span className="text-foreground/60">{activeCountry}</span>
        </div>
      )}

    </div>
  );
}

export function ComparisonStatusBar() {
  const { activeCountry, comparisonCountry, clearComparison } =
    useLocationStore();

  if (!comparisonCountry) return null;

  return (
    <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase px-1 select-none">
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-chart-1" />
        <span className="text-foreground/80">{activeCountry}</span>
      </span>
      <span className="text-muted-foreground/40">vs</span>
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-chart-2" />
        <span className="text-foreground/80">{comparisonCountry}</span>
      </span>
      <button
        onClick={clearComparison}
        className="ml-1 px-1.5 py-0.5 rounded text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
      >
        &times; Clear
      </button>
    </div>
  );
}
