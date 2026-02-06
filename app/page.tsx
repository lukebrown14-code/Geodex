"use client";

import { useState } from "react";
import { CountryData } from "@/types/country";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null,
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        onSelectCountry={setSelectedCountry}
        hasCountry={!!selectedCountry}
      />
      <main className="flex-1">
        {selectedCountry ? (
          <div className="pt-6">
            <Dashboard country={selectedCountry} />
          </div>
        ) : (
          <Hero onSelectCountry={setSelectedCountry} />
        )}
      </main>
      <Footer />
    </div>
  );
}
