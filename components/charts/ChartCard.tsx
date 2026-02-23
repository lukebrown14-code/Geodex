"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Info } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useApiData } from "@/hooks/useApiData";

interface ChartCardProps<T> {
  endpoint: string;
  title: string;
  location: string;
  className?: string;
  info?: string;
  infoFn?: (data: T[]) => string;
  children: (data: T[]) => ReactNode;
}

export function ChartCard<T>({
  endpoint,
  title,
  location,
  className,
  info,
  infoFn,
  children,
}: ChartCardProps<T>) {
  const params = useMemo(
    () => (location ? { location } : undefined),
    [location],
  );
  const { data, loading, error } = useApiData<T>(endpoint, params);
  const [infoOpen, setInfoOpen] = useState(false);

  const dynamicInfo = useMemo(
    () => (infoFn && data.length > 0 ? infoFn(data) : null),
    [infoFn, data],
  );

  // Call children when not loading/errored; if they return null it means no plottable data
  const chartContent = !loading && !error ? children(data) : null;

  // Hide the card entirely when loading has completed and there's nothing to show
  if (!loading && !error && chartContent == null) return null;

  return (
    <Card className={`h-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle className="font-mono text-xs tracking-wider uppercase">{title}</CardTitle>
        {info && (
          <CardAction>
            <Tooltip open={infoOpen} onOpenChange={setInfoOpen}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Chart info"
                  onClick={() => setInfoOpen((prev) => !prev)}
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64 text-pretty">
                <p>{info}</p>
                {dynamicInfo && (
                  <p className="mt-1 font-medium">{dynamicInfo}</p>
                )}
              </TooltipContent>
            </Tooltip>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="animate-pulse h-50 flex flex-col justify-end gap-0">
            {/* Fake chart area */}
            <div className="flex-1 flex items-end gap-1.5 px-6 pt-4 pb-2">
              <div className="h-[45%] flex-1 rounded-sm bg-muted" />
              <div className="h-[70%] flex-1 rounded-sm bg-muted" />
              <div className="h-[55%] flex-1 rounded-sm bg-muted" />
              <div className="h-[85%] flex-1 rounded-sm bg-muted" />
              <div className="h-[60%] flex-1 rounded-sm bg-muted" />
              <div className="h-[40%] flex-1 rounded-sm bg-muted" />
              <div className="h-[75%] flex-1 rounded-sm bg-muted" />
              <div className="h-[50%] flex-1 rounded-sm bg-muted" />
            </div>
            {/* Fake X axis */}
            <div className="h-px bg-muted mx-6" />
            <div className="flex gap-3 px-6 pt-1.5">
              <div className="h-2 w-8 rounded bg-muted" />
              <div className="h-2 w-8 rounded bg-muted" />
              <div className="h-2 w-8 rounded bg-muted" />
              <div className="h-2 w-8 rounded bg-muted" />
            </div>
          </div>
        )}
        {error && <p className="text-red-500">Error: {error}</p>}
        {chartContent}
      </CardContent>
    </Card>
  );
}
