"use client";

import { useState } from "react";
import { Globe } from "lucide-react";

import { DemographicGraphs } from "@/components/sections/DemographicGraphs";
import { EconomicGraphs } from "@/components/sections/EconomicGraphs";

import { DemographicScoreCard } from "@/components/charts/demographics/DemographicScoreCard";
import { SectionTabs } from "@/components/ui/SectionTabs";
import { Header } from "@/components/layout/Header";

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
              <SectionTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {activeTab === "demographics" ? (
              <DemographicGraphs searchedLocation={searchedLocation} />
            ) : (
              <EconomicGraphs searchedLocation={searchedLocation} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Globe className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h2 className="text-lg font-medium text-foreground/80">
              No country selected
            </h2>
            <p className="text-muted-foreground text-sm mt-1 max-w-sm">
              Enter a country name in the search bar above to explore
              demographic and vital statistics.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
