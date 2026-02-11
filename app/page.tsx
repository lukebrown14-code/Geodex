"use client";

import { useState } from "react";
import { Search, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PopulationPyramid } from "@/components/charts/PopulationPyramid";
import { DependencyPieChart } from "@/components/charts/DependencyPieChart";
import { DemoLineChart } from "@/components/charts/DemoLineChart";
import { DemoBarChart } from "@/components/charts/DemoBarChart";
import { SexRatioChart } from "@/components/charts/SexRatioChart";
import { PopulationDensityCard } from "@/components/charts/PopulationDensityCard";
import { NaturalGrowthChart } from "@/components/charts/NaturalGrowthChart";
import { DemographicScoreCard } from "@/components/charts/DemographicScoreCard";

export default function Home() {
  const [location, setLocation] = useState("");
  const [searchedLocation, setSearchedLocation] = useState("");

  const handleSearch = () => {
    const trimmed = location.trim();
    if (!trimmed) return;
    setSearchedLocation(
      trimmed.replace(/^./, trimmed[0].toUpperCase()),
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          {/* Top row on mobile: brand + toggle */}
          <div className="flex items-center justify-between sm:justify-start shrink-0">
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-foreground leading-none">
                Country Statistics
              </h1>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                Demographic data explorer
              </p>
            </div>
            <div className="sm:hidden">
              <ThemeToggle />
            </div>
          </div>

          {/* Search — full width on mobile, centered on desktop */}
          <div className="relative flex-1 max-w-md sm:mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search by country..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-9 pr-16 py-2 text-sm rounded-lg bg-muted/50 text-foreground border border-border/50 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-chart-1/30 focus:border-chart-1/40 transition-all"
            />
            <button
              onClick={handleSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-chart-1 text-white text-xs font-medium rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* Toggle — desktop only (mobile is in brand row) */}
          <div className="hidden sm:block ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {searchedLocation ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demographic Health Score */}
            <div className="col-span-full animate-fade-in-up" style={{ animationDelay: "0ms" }}>
              <DemographicScoreCard location={searchedLocation} />
            </div>

            {/* Section: Population Structure */}
            <div className="col-span-full mt-2">
              <h2 className="text-lg sm:text-xl font-semibold border-l-4 border-chart-1 pl-3">
                Population Structure Analysis
              </h2>
              <p className="text-muted-foreground text-sm mt-1 pl-3 ml-1">
                {searchedLocation} — age distribution and dependency metrics
              </p>
            </div>

            <div className="col-span-full animate-fade-in-up" style={{ animationDelay: "0ms" }}>
              <PopulationPyramid location={searchedLocation} />
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <DemoLineChart location={searchedLocation} type="median" />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <DependencyPieChart location={searchedLocation} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "250ms" }}>
              <SexRatioChart location={searchedLocation} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <PopulationDensityCard location={searchedLocation} />
            </div>

            {/* Section: Vital Reproduction Metrics */}
            <div className="col-span-full mt-4">
              <h2 className="text-lg sm:text-xl font-semibold border-l-4 border-chart-2 pl-3">
                Vital Reproduction Metrics
              </h2>
              <p className="text-muted-foreground text-sm mt-1 pl-3 ml-1">
                Fertility, mortality, and life expectancy trends
              </p>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <NaturalGrowthChart location={searchedLocation} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
              <DemoLineChart location={searchedLocation} type="TFR" />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "600ms" }}>
              <DemoLineChart location={searchedLocation} type="InfantDeaths" />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "700ms" }}>
              <DemoBarChart location={searchedLocation} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "800ms" }}>
              <DemoLineChart location={searchedLocation} type="lifeExpect" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Globe className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h2 className="text-lg font-medium text-foreground/80">No country selected</h2>
            <p className="text-muted-foreground text-sm mt-1 max-w-sm">
              Enter a country name in the search bar above to explore demographic and vital statistics.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
