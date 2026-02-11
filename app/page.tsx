"use client";

import { useState } from "react";
import { PopulationPyramid } from "@/components/charts/PopulationPyramid";
import { DependencyPieChart } from "@/components/charts/DependencyPieChart";
import { DemoLineChart } from "@/components/charts/MedianAgeLineChart";
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
        <>
          <h2 className="text-4xl bg-red-300">Population Structure Analysis — {searchedLocation}</h2>
          <h3>Population Pyramid</h3>
          <PopulationPyramid location={searchedLocation} />

          <h3>Median Age</h3>
          <DemoLineChart location={searchedLocation} type="median" />

          <h3>Dependency Ratio</h3>
          <DependencyPieChart location={searchedLocation} />

          <h2 className="text-4xl bg-blue-300"> Vital Reproduction Metrics</h2>
          <h3>Total Fertility Rate (TFR)</h3>
          <DemoLineChart location={searchedLocation} type="TFR" />

          <h3>Infant Deaths</h3>
          <DemoLineChart location={searchedLocation} type="InfantDeaths" />

          <h3> Net Migration </h3>
          <DemoBarChart location={searchedLocation} />
        </>
      ) : (
        <p className="text-foreground/60">Enter a country name and press Search to view statistics.</p>
      )}
    </div>
  );
}
