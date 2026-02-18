"use client";

import { Globe, X } from "lucide-react";
import useLocationStore from "@/lib/store";

export function CountryTabs() {
  const { openCountries, activeCountry, setActiveCountry, removeCountry } =
    useLocationStore();

  if (openCountries.length === 0) return null;

  return (
    <div className="scrollbar-hide overflow-x-auto">
      <div className="inline-flex w-full sm:w-auto bg-muted/50 border border-border/50 rounded-xl p-1 gap-1">
        {openCountries.map((country) => {
          const isActive = activeCountry === country;
          return (
            <button
              key={country}
              onClick={() => setActiveCountry(country)}
              className={`group relative flex items-center gap-2 px-3 py-2 font-mono text-xs tracking-wider uppercase rounded-lg cursor-pointer transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? "bg-background shadow-sm border-b-2 border-chart-1 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="h-3.5 w-3.5 shrink-0" />
              {isActive && (
                <span className="text-chart-1/40 select-none">//</span>
              )}
              {country}
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCountry(country);
                }}
                className={`ml-1 p-0.5 rounded hover:bg-destructive/20 hover:text-destructive transition-colors ${
                  isActive
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
