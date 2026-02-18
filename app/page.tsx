"use client";

import { useState } from "react";
import { DemographicGraphs } from "@/components/sections/DemographicGraphs";
import { EconomicGraphs } from "@/components/sections/EconomicGraphs";

import { SectionTabs } from "@/components/ui/SectionTabs";
import { CountryTabs, ComparisonStatusBar } from "@/components/ui/CountryTabs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import useLocationStore from "@/lib/store";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"demographics" | "economics">(
    "demographics",
  );

  const { searchedLocation } = useLocationStore();

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
              <ComparisonStatusBar />
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
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {/* CSS Reticle */}
            <div className="relative h-12 w-12 mb-6">
              <div className="absolute inset-0 rounded-full border border-muted-foreground/20" />
              <div className="absolute inset-2 rounded-full border border-muted-foreground/10" />
              <div className="absolute top-1/2 left-0 w-full h-px bg-muted-foreground/20" />
              <div className="absolute left-1/2 top-0 h-full w-px bg-muted-foreground/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-chart-1/40" />
            </div>
            <h2 className="font-mono text-sm tracking-wider uppercase text-foreground/80">
              No location selected
            </h2>
            <p className="font-mono text-xs text-muted-foreground mt-2 max-w-sm">
              <span className="text-chart-1/50 select-none">// </span>Query a country to begin analysis
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
