"use client";

import { useState } from "react";
import { TrendingUp, Users, GitCompare } from "lucide-react";
import { DemographicGraphs } from "@/components/sections/DemographicGraphs";
import { EconomicGraphs } from "@/components/sections/EconomicGraphs";

import { SectionTabs } from "@/components/ui/SectionTabs";
import { CountryTabs } from "@/components/ui/CountryTabs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import useLocationStore from "@/lib/store";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"demographics" | "economics">(
    "demographics",
  );

  const { searchedLocation, setSearchedLocation } = useLocationStore();

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {searchedLocation ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full mt-2">
              <CountryTabs />
            </div>
            <div className="col-span-full">
              <SectionTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {activeTab === "demographics" ? (
              <DemographicGraphs key={searchedLocation} searchedLocation={searchedLocation} />
            ) : (
              <EconomicGraphs key={searchedLocation} searchedLocation={searchedLocation} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-14">
            {/* Zone 1 — Hero header */}
            <div className="flex flex-col items-center gap-5 animate-fade-in-up">
              {/* Reticle graphic */}
              <div className="relative h-20 w-20 overflow-hidden">
                <div className="animate-reticle-pulse absolute inset-0 rounded-full border-2 border-muted-foreground/20" />
                <div className="absolute inset-3 rounded-full border border-muted-foreground/15" />
                <div className="absolute inset-6 rounded-full border border-muted-foreground/10" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-muted-foreground/20" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-muted-foreground/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-chart-1/60" />
                {/* Scanline sweep */}
                <div className="animate-scanline absolute left-0 w-full h-px bg-chart-1/30" />
              </div>

              <div>
                <p className="font-mono font-bold tracking-widest text-3xl text-foreground">
                  GEODEX
                </p>
                <p className="font-mono text-xs text-chart-1/60 mt-1">
                  // Country intelligence at a glance
                </p>
              </div>

              <p className="font-mono text-sm text-muted-foreground max-w-md">
                Explore economic and demographic data for any country in the world.
              </p>
            </div>

            {/* Zone 2 — Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
              <div className="animate-fade-in-up [animation-delay:100ms] flex flex-col items-center gap-3 border border-border/50 rounded-lg px-5 py-6">
                <TrendingUp className="h-5 w-5 text-chart-1" />
                <p className="font-mono text-xs uppercase tracking-wider text-foreground/80">Economics</p>
                <p className="font-mono text-xs text-muted-foreground text-center">GDP, inflation, unemployment, trade balance</p>
              </div>
              <div className="animate-fade-in-up [animation-delay:200ms] flex flex-col items-center gap-3 border border-border/50 rounded-lg px-5 py-6">
                <Users className="h-5 w-5 text-chart-2" />
                <p className="font-mono text-xs uppercase tracking-wider text-foreground/80">Demographics</p>
                <p className="font-mono text-xs text-muted-foreground text-center">Population, age structure, life expectancy</p>
              </div>
              <div className="animate-fade-in-up [animation-delay:300ms] flex flex-col items-center gap-3 border border-border/50 rounded-lg px-5 py-6">
                <GitCompare className="h-5 w-5 text-chart-3" />
                <p className="font-mono text-xs uppercase tracking-wider text-foreground/80">Compare</p>
                <p className="font-mono text-xs text-muted-foreground text-center">Side-by-side country comparison</p>
              </div>
            </div>

            {/* Zone 3 — Quick-search shortcuts */}
            <div className="animate-fade-in-up [animation-delay:400ms] flex flex-col items-center gap-3">
              <p className="font-mono text-[10px] text-muted-foreground/50">// popular searches</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["United States", "Germany", "Japan", "Brazil", "India", "Nigeria"].map((country) => (
                  <button
                    key={country}
                    onClick={() => setSearchedLocation(country)}
                    className="font-mono text-xs px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 hover:border-chart-1/40 hover:text-foreground hover:bg-chart-1/5 transition-all text-muted-foreground cursor-pointer"
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
