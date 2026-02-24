"use client"

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SearchBar } from "@/components/ui/SearchBar";
import useLocationStore from "@/lib/store";

export function Header() {
  const { searchedLocation, reset } = useLocationStore();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-6">
        {/* Brand — always leftmost */}
        <button
          onClick={reset}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          aria-label="Return to home"
        >
          {/* Reticle / crosshair mark */}
          <div className="relative h-6 w-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-chart-1/60" />
            <div className="absolute h-2 w-2 rounded-full border border-chart-1/80" />
            <div className="absolute h-[3px] w-[3px] rounded-full bg-chart-1" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[2px] w-[1px] h-[5px] bg-chart-1/70" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[2px] w-[1px] h-[5px] bg-chart-1/70" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[2px] h-[1px] w-[5px] bg-chart-1/70" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] h-[1px] w-[5px] bg-chart-1/70" />
          </div>

          <div>
            <h1 className="font-mono text-sm font-medium tracking-widest uppercase text-foreground leading-none group-hover:text-chart-1 transition-colors">
              GEODEX
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 font-mono hidden sm:block">
              <span className="text-chart-1/50 select-none">{"//"} </span>
              Country intelligence at a glance
            </p>
          </div>
        </button>

        {!!searchedLocation && (
          <>
            {/* Decorative separator — desktop only */}
            <div className="hidden sm:flex items-center self-stretch py-1">
              <div className="relative w-px h-full bg-border/60">
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-[5px] h-[1px] bg-chart-1/40" />
                <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-[5px] h-[1px] bg-chart-1/40" />
              </div>
            </div>

            <SearchBar className="flex-1 max-w-md sm:mx-auto" />
          </>
        )}

        {/* Toggle — always rightmost */}
        <div className="ml-auto shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
