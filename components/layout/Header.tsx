import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Search } from "lucide-react";
import useLocationStore from "@/lib/store";
import { useState } from "react";

export function Header() {
  const [location, setLocation] = useState("");
  const { setSearchedLocation } = useLocationStore();

  const handleSearch = () => {
    const trimmed = location.trim();
    if (!trimmed) return;
    setSearchedLocation(trimmed.replace(/^./, trimmed[0].toUpperCase()));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        {/* Top row on mobile: brand + toggle */}
        <div className="flex items-center justify-between sm:justify-start shrink-0">
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-foreground leading-none">
              Country Statistics
            </h1>
            <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
              Demographic data explorer
            </p>
          </div>
          <div className="sm:hidden">
            <ThemeToggle />
          </div>
        </div>

        {/* Search — full width on mobile, centered on desktop */}
        <div className="relative flex-1 max-w-md sm:mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search by country..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-9 pr-16 py-2 text-sm rounded-lg bg-muted/50 text-foreground border border-border/50 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-chart-1/30 focus:border-chart-1/40 transition-all"
          />
          <button
            onClick={handleSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-chart-1 text-white text-xs font-medium rounded-md hover:opacity-90 transition-opacity cursor-pointer"
          >
            Search
          </button>
        </div>

        {/* Toggle — desktop only (mobile is in brand row) */}
        <div className="hidden sm:block ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
