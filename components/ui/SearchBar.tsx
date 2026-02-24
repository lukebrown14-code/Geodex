"use client"

import { Search, Clock } from "lucide-react";
import useLocationStore from "@/lib/store";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useCountries } from "@/hooks/useCountries";
import Fuse from "fuse.js";

const RECENT_KEY = "geodex-recent";
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(country: string) {
  const recent = getRecentSearches().filter((c) => c !== country);
  recent.unshift(country);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const [location, setLocation] = useState("");
  const { setSearchedLocation } = useLocationStore();
  const { countries, error: countriesError } = useCountries();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const fuse = useMemo(
    () => new Fuse(countries, { threshold: 0.4 }),
    [countries],
  );

  const filtered = location.trim()
    ? fuse.search(location.trim()).map((r) => r.item).slice(0, 50)
    : [];

  const showRecent = !location.trim() && recentSearches.length > 0;
  const dropdownItems = showRecent ? recentSearches : filtered;

  const handleSearch = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const formatted = trimmed.replace(/^./, trimmed[0].toUpperCase());
    setSearchedLocation(formatted);
    saveRecentSearch(formatted);
    setRecentSearches(getRecentSearches());
    setLocation("");
    setShowDropdown(false);
  }, [setSearchedLocation]);

  const selectCountry = useCallback((name: string) => {
    setLocation(name);
    handleSearch(name);
  }, [handleSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || dropdownItems.length === 0) {
      if (e.key === "Enter") handleSearch(location);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev < dropdownItems.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : dropdownItems.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < dropdownItems.length) {
          selectCountry(dropdownItems[highlightIndex]);
        } else {
          handleSearch(location);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setHighlightIndex(-1);
        break;
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightIndex] as HTMLElement;
      if (!item) return;
      // account for header element offset
      const headerEl = listRef.current.querySelector("[data-recent-header]");
      const actualIndex = headerEl ? highlightIndex + 1 : highlightIndex;
      const el = listRef.current.children[actualIndex] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={`geodex-search-frame relative${className ? ` ${className}` : ""}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
      <input
        type="text"
        placeholder="Query location..."
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
          setShowDropdown(true);
          setHighlightIndex(-1);
        }}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        className="w-full pl-9 pr-16 py-2 font-mono text-xs rounded-lg bg-muted/50 text-foreground border border-border/50 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-chart-1/30 focus:border-chart-1/40 transition-all"
      />
      <button
        onClick={() => handleSearch(location)}
        className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-chart-1 text-white font-mono text-[10px] tracking-wider uppercase font-medium rounded-md hover:opacity-90 transition-opacity cursor-pointer"
      >
        Query
      </button>

      {/* Country load error hint */}
      {countriesError && (
        <p className="absolute left-0 right-0 top-full mt-1 px-3 py-2 font-mono text-[11px] text-destructive bg-destructive border border-destructive/20 rounded-lg z-50">
          {countriesError} — autocomplete unavailable
        </p>
      )}

      {/* Autocomplete / recent dropdown */}
      {!countriesError && showDropdown && dropdownItems.length > 0 && (
        <ul
          ref={listRef}
          className="search-dropdown absolute left-0 right-0 top-full mt-1 max-h-56 overflow-y-auto rounded-lg border border-border shadow-lg z-50"
        >
          {showRecent && (
            <li
              data-recent-header
              className="px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase text-muted-foreground select-none flex items-center gap-1.5"
            >
              <Clock className="h-3 w-3" />
              Recent
            </li>
          )}
          {dropdownItems.map((country, i) => (
            <li
              key={country}
              onMouseDown={(e) => {
                e.preventDefault();
                selectCountry(country);
              }}
              onMouseEnter={() => setHighlightIndex(i)}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${i === highlightIndex
                ? "bg-neutral-100 dark:bg-neutral-800 text-foreground"
                : "text-muted-foreground"
                }`}
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
