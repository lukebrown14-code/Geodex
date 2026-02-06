"use client";

import SearchBar from "./SearchBar";
import { CountryData } from "@/types/country";

interface Props {
  onSelectCountry: (country: CountryData) => void;
  hasCountry: boolean;
}

export default function Header({ onSelectCountry, hasCountry }: Props) {
  return (
    <header className="w-full border-b border-white/10">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border border-blue-500/40 bg-blue-500/10">
            <svg
              className="h-4 w-4 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"
              />
            </svg>
          </div>
          <h1 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-white">
            Demographics
          </h1>
        </div>
        <SearchBar onSelect={onSelectCountry} />
        {!hasCountry && (
          <p className="hidden font-body text-xs text-white/30 lg:block">
            Select a country to begin
          </p>
        )}
      </div>
    </header>
  );
}
