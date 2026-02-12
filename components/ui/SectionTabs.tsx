"use client";

import { Users, TrendingUp } from "lucide-react";

type Tab = "demographics" | "economics";

interface SectionTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs = [
  { id: "demographics" as const, label: "Demographics", icon: Users },
  { id: "economics" as const, label: "Economics", icon: TrendingUp },
];

export function SectionTabs({ activeTab, onTabChange }: SectionTabsProps) {
  return (
    <div className="inline-flex w-full sm:w-auto bg-muted/50 border border-border/50 rounded-xl p-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200 ${
              isActive
                ? "bg-background shadow-sm border-b-2 border-chart-1 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
