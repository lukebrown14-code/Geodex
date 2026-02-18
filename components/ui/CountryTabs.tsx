"use client";

import { Globe, X, GitCompareArrows } from "lucide-react";
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

  return (
    <div className="scrollbar-hide overflow-x-auto">
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

              {/* Compare button — shown on non-active, non-comparison tabs */}
              {!isActive && !isComparison && openCountries.length > 1 && (
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setComparisonCountry(country);
                  }}
                  title={`Compare with ${country}`}
                  className="ml-0.5 p-0.5 rounded hover:bg-chart-2/20 hover:text-chart-2 transition-colors opacity-0 group-hover:opacity-60 hover:!opacity-100 sm:opacity-0 max-sm:opacity-60"
                >
                  <GitCompareArrows className="h-3 w-3" />
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
    </div>
  );
}
