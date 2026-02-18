import { GitBranch } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-center gap-2 text-muted-foreground">
        <span className="font-mono text-xs tracking-wider">
          <span className="text-chart-1/50 select-none">// </span>
          GEODEX
        </span>
        <span className="text-border">|</span>
        <a
          href="https://github.com/lukebrown14-code/Geodex"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider hover:text-foreground transition-colors"
        >
          <GitBranch className="h-3.5 w-3.5" />
          GitHub
        </a>
      </div>
    </footer>
  );
}
