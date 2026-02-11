"use client";

import { useState } from "react";
import { PopulationPyramid } from "@/components/charts/PopulationPyramid";
import { DependencyPieChart } from "@/components/charts/DependencyPieChart";
import { DemoLineChart } from "@/components/charts/DemoLineChart";
import { DemoBarChart } from "@/components/charts/DemoBarChart";

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
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">
        Country Statistics Dashboard
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by country..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="px-3 py-2 border border-foreground/20 rounded-md bg-background text-foreground w-64"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-80"
        >
          Search
        </button>
      </div>

      {searchedLocation ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h2 className="col-span-full text-2xl font-semibold">
            Population Structure Analysis — {searchedLocation}
          </h2>

          <div className="col-span-full">
            <PopulationPyramid location={searchedLocation} />
          </div>

          <DemoLineChart location={searchedLocation} type="median" />
          <DependencyPieChart location={searchedLocation} />

          <h2 className="col-span-full text-2xl font-semibold">
            Vital Reproduction Metrics
          </h2>

          <DemoLineChart location={searchedLocation} type="TFR" />
          <DemoLineChart location={searchedLocation} type="InfantDeaths" />
          <DemoBarChart location={searchedLocation} />
          <DemoLineChart location={searchedLocation} type="lifeExpect" />
        </div>
      ) : (
        <p className="text-foreground/60">Enter a country name and press Search to view statistics.</p>
      )}
    </div>
  );
}
