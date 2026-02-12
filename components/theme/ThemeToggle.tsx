"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-9 w-9" />;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="h-8 w-8 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-accent transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-3.5 w-3.5 text-foreground/70" />
      ) : (
        <Moon className="h-3.5 w-3.5 text-foreground/70" />
      )}
    </button>
  );
}
