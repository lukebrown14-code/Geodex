import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Globe, BarChart2, Database, GitBranch } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Geodex",
  description: "Learn about Geodex, a country intelligence dashboard powered by World Bank data.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative h-12 w-12 mb-6">
            <div className="absolute inset-0 rounded-full border border-muted-foreground/20" />
            <div className="absolute inset-2 rounded-full border border-muted-foreground/10" />
            <div className="absolute top-1/2 left-0 w-full h-px bg-muted-foreground/20" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-muted-foreground/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-chart-1/40" />
          </div>
          <h1 className="font-mono text-2xl font-bold tracking-widest uppercase text-foreground">
            GEODEX
          </h1>
          <p className="font-mono text-xs text-muted-foreground mt-3 max-w-md">
            <span className="text-chart-1/50 select-none">// </span>
            Country intelligence at a glance
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-12">

          {/* What is Geodex */}
          <section>
            <h2 className="font-mono text-xs tracking-wider uppercase text-muted-foreground border-l-4 border-chart-1 pl-3 mb-4">
              <span className="text-chart-1/50 select-none">// </span>What is Geodex
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Geodex is a country intelligence dashboard that lets you explore economic and demographic data for countries around the world. Search any location to view charts, scores, and trends — or compare two countries side by side.
            </p>
          </section>

          {/* Features */}
          <section>
            <h2 className="font-mono text-xs tracking-wider uppercase text-muted-foreground border-l-4 border-chart-2 pl-3 mb-6">
              <span className="text-chart-1/50 select-none">// </span>Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Globe,
                  label: "Global Coverage",
                  detail: "Data spanning hundreds of countries and territories.",
                  color: "text-chart-1",
                },
                {
                  icon: BarChart2,
                  label: "Rich Visualisations",
                  detail: "GDP, inflation, population, demographics and more in interactive charts.",
                  color: "text-chart-2",
                },
                {
                  icon: Database,
                  label: "Open Data",
                  detail: "Demographic data from UN World Population Prospects; economic data from the World Bank.",
                  color: "text-chart-3",
                },
              ].map(({ icon: Icon, label, detail, color }) => (
                <div
                  key={label}
                  className="rounded-lg border border-border/50 px-4 py-4 flex flex-col gap-2"
                >
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="font-mono text-xs tracking-wider uppercase text-foreground">
                    {label}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Data sources */}
          <section>
            <h2 className="font-mono text-xs tracking-wider uppercase text-muted-foreground border-l-4 border-chart-3 pl-3 mb-4">
              <span className="text-chart-1/50 select-none">// </span>Data Sources
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Demographic indicators (population structure, fertility, life expectancy, and more) are sourced from the{" "}
              <a
                href="https://population.un.org/wpp/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-chart-1 hover:underline"
              >
                UN World Population Prospects
              </a>
              . Economic indicators (GDP, inflation, unemployment, debt, and trade) are sourced from the{" "}
              <a
                href="https://data.worldbank.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-chart-1 hover:underline"
              >
                World Bank Open Data
              </a>{" "}
              catalogue. All data is stored in a Supabase database.
            </p>
          </section>

          {/* Tech stack */}
          <section>
            <h2 className="font-mono text-xs tracking-wider uppercase text-muted-foreground border-l-4 border-chart-4 pl-3 mb-4">
              <span className="text-chart-1/50 select-none">// </span>Built With
            </h2>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Supabase", "Recharts", "Tailwind CSS", "shadcn/ui"].map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[11px] tracking-wider px-2.5 py-1 rounded-md bg-muted/60 border border-border/40 text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Links */}
          <section className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-chart-1/50 select-none">← </span>Back to app
            </Link>
            <a
              href="https://github.com/lukebrown14-code/Geodex"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <GitBranch className="h-3.5 w-3.5" />
              GitHub
            </a>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
