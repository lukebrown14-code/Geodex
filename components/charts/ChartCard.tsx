"use client";

import { useMemo, type ReactNode } from "react";
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

  const dynamicInfo = useMemo(
    () => (infoFn && data.length > 0 ? infoFn(data) : null),
    [infoFn, data],
  );

  return (
    <Card className={`h-full ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {info && (
          <CardAction>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Chart info"
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
        {loading && <div className="animate-pulse bg-muted rounded h-50" />}
        {error && <p className="text-red-500">Error: {error}</p>}
        {children(data)}
      </CardContent>
    </Card>
  );
}
