import { PopulationPyramid } from "@/components/charts/demographics/PopulationPyramid";
import { DemoLineChart } from "@/components/charts/demographics/DemoLineChart";
import { DependencyPieChart } from "@/components/charts/demographics/DependencyPieChart";
import { NaturalGrowthChart } from "@/components/charts/demographics/NaturalGrowthChart";
import { DemoBarChart } from "@/components/charts/demographics/DemoBarChart";
import { SexRatioChart } from "@/components/charts/demographics/SexRatioChart";
import { PopulationDensityCard } from "@/components/charts/demographics/PopulationDensityCard";
import { DemographicScoreCard } from "../charts/demographics/DemographicScoreCard";

export function DemographicGraphs({
  searchedLocation,
}: {
  searchedLocation: string;
}) {
  return (
    <div key="demographics" className="col-span-full animate-tab-enter">
      <div
        className="col-span-full animate-fade-in-up mb-5"
        style={{ animationDelay: "0ms" }}
      >
        <DemographicScoreCard location={searchedLocation} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-full">
          <h2 className="text-lg sm:text-xl font-semibold border-l-4 border-chart-1 pl-3 ">
            Population Structure Analysis
          </h2>
          <p className="text-muted-foreground text-sm mt-1 pl-3 ml-1">
            {searchedLocation} — age distribution and dependency metrics
          </p>
        </div>

        <div
          className="col-span-full animate-fade-in-up"
          style={{ animationDelay: "0ms" }}
        >
          <PopulationPyramid location={searchedLocation} />
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <DemoLineChart location={searchedLocation} type="median" />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <DependencyPieChart location={searchedLocation} />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "250ms" }}>
          <SexRatioChart location={searchedLocation} />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <PopulationDensityCard location={searchedLocation} />
        </div>

        <div className="col-span-full mt-4">
          <h2 className="text-lg sm:text-xl font-semibold border-l-4 border-chart-2 pl-3">
            Vital Reproduction Metrics
          </h2>
          <p className="text-muted-foreground text-sm mt-1 pl-3 ml-1">
            Fertility, mortality, and life expectancy trends
          </p>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <NaturalGrowthChart location={searchedLocation} />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
          <DemoLineChart location={searchedLocation} type="TFR" />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "600ms" }}>
          <DemoLineChart location={searchedLocation} type="InfantDeaths" />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "700ms" }}>
          <DemoLineChart location={searchedLocation} type="lifeExpect" />
        </div>
        <div
          className="animate-fade-in-up col-span-full max-w-3xl mx-auto w-full"
          style={{ animationDelay: "800ms" }}
        >
          <DemoBarChart location={searchedLocation} />
        </div>
      </div>
    </div>
  );
}
