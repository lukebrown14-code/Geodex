"use client";

import { getAllCountries } from "@/lib/countries";
import { CountryData } from "@/types/country";

interface Props {
  onSelectCountry: (country: CountryData) => void;
}

export default function Hero({ onSelectCountry }: Props) {
  const countries = getAllCountries();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center lg:py-32">
      <h2 className="font-heading text-5xl font-black uppercase tracking-tight text-white lg:text-7xl">
        Explore
        <span className="block text-blue-500">Demographics</span>
      </h2>
      <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-white/40">
        Country demographics, economic health, and key indicators — simplified
        for investment research.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {countries.map((c) => (
          <button
            key={c.code}
            onClick={() => onSelectCountry(c)}
            className="flex items-center gap-2 border border-white/10 bg-white/[0.02] px-4 py-2 font-body text-sm text-white/60 transition-all duration-200 hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-white"
          >
            <span>{c.flag}</span>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
