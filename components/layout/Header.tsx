import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Search } from "lucide-react";
import useLocationStore from "@/lib/store";
import { useState, useRef, useEffect, useCallback } from "react";
import { useCountries } from "@/hooks/useCountries";

export function Header() {
  const [location, setLocation] = useState("");
  const { setSearchedLocation } = useLocationStore();
  const { countries } = useCountries();

  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = location.trim()
    ? countries.filter((c) =>
        c.toLowerCase().includes(location.trim().toLowerCase())
      ).slice(0, 50)
    : [];

  const handleSearch = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setSearchedLocation(trimmed.replace(/^./, trimmed[0].toUpperCase()));
    setShowDropdown(false);
  }, [setSearchedLocation]);

  const selectCountry = useCallback((name: string) => {
    setLocation(name);
    handleSearch(name);
  }, [handleSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || filtered.length === 0) {
      if (e.key === "Enter") handleSearch(location);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < filtered.length) {
          selectCountry(filtered[highlightIndex]);
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
      item?.scrollIntoView({ block: "nearest" });
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
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        {/* Top row on mobile: brand + toggle */}
        <div className="flex items-center justify-between sm:justify-start shrink-0">
          <div className="flex items-center gap-3">
            {/* Reticle / crosshair mark */}
            <div className="relative h-6 w-6 flex items-center justify-center">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border border-chart-1/60" />
              {/* Inner ring */}
              <div className="absolute h-2 w-2 rounded-full border border-chart-1/80" />
              {/* Center dot */}
              <div className="absolute h-[3px] w-[3px] rounded-full bg-chart-1" />
              {/* Tick marks */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[2px] w-[1px] h-[5px] bg-chart-1/70" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[2px] w-[1px] h-[5px] bg-chart-1/70" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[2px] h-[1px] w-[5px] bg-chart-1/70" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] h-[1px] w-[5px] bg-chart-1/70" />
            </div>

            <div>
              <h1 className="font-mono text-sm font-medium tracking-widest uppercase text-foreground leading-none">
                GEODEX
              </h1>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 font-mono">
                <span className="text-chart-1/50 select-none">{"//"} </span>
                Country intelligence at a glance
              </p>
            </div>
          </div>
          <div className="sm:hidden">
            <ThemeToggle />
          </div>
        </div>

        {/* Decorative separator — desktop only */}
        <div className="hidden sm:flex items-center self-stretch py-1">
          <div className="relative w-px h-full bg-border/60">
            <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-[5px] h-[1px] bg-chart-1/40" />
            <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-[5px] h-[1px] bg-chart-1/40" />
          </div>
        </div>

        {/* Search — full width on mobile, centered on desktop */}
        <div ref={wrapperRef} className="geodex-search-frame relative flex-1 max-w-md sm:mx-auto">
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
            onFocus={() => {
              if (location.trim()) setShowDropdown(true);
            }}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-16 py-2 font-mono text-xs rounded-lg bg-muted/50 text-foreground border border-border/50 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-chart-1/30 focus:border-chart-1/40 transition-all"
          />
          <button
            onClick={() => handleSearch(location)}
            className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-chart-1 text-white font-mono text-[10px] tracking-wider uppercase font-medium rounded-md hover:opacity-90 transition-opacity cursor-pointer"
          >
            Query
          </button>

          {/* Autocomplete dropdown */}
          {showDropdown && filtered.length > 0 && (
            <ul
              ref={listRef}
              className="absolute left-0 right-0 top-full mt-1 max-h-56 overflow-y-auto rounded-lg border border-border/60 bg-background shadow-lg z-50"
            >
              {filtered.map((country, i) => (
                <li
                  key={country}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectCountry(country);
                  }}
                  onMouseEnter={() => setHighlightIndex(i)}
                  className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                    i === highlightIndex
                      ? "bg-chart-1/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {country}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Toggle — desktop only (mobile is in brand row) */}
        <div className="hidden sm:block ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
