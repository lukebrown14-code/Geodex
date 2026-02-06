"use client";

import { useState, useRef, useEffect } from "react";
import { searchCountries } from "@/lib/countries";
import { CountryData } from "@/types/country";

interface Props {
  onSelect: (country: CountryData) => void;
}

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CountryData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const matches = searchCountries(query);
      setResults(matches);
      setIsOpen(matches.length > 0);
      setActiveIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(country: CountryData) {
    setQuery(country.name);
    setIsOpen(false);
    onSelect(country);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search countries..."
          aria-label="Search countries"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
          className="w-full border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 font-body text-sm text-white placeholder-white/30 outline-none transition-colors duration-200 focus:border-blue-500/50 focus:bg-white/[0.05]"
        />
      </div>
      {isOpen && (
        <ul
          role="listbox"
          className="absolute top-full z-50 mt-1 w-full border border-white/10 bg-[#111111]"
        >
          {results.map((country, i) => (
            <li
              key={country.code}
              role="option"
              aria-selected={i === activeIndex}
              className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors ${
                i === activeIndex
                  ? "bg-white/[0.08] text-white"
                  : "text-white/70 hover:bg-white/[0.05]"
              }`}
              onMouseDown={() => handleSelect(country)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span className="text-lg">{country.flag}</span>
              <span className="font-body text-sm">{country.name}</span>
              <span className="ml-auto font-heading text-[10px] uppercase tracking-wider text-white/30">
                {country.code}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
