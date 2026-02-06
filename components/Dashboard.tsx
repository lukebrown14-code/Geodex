"use client";

import { CountryData } from "@/types/country";
import { formatNumber, formatCurrency } from "@/lib/countries";
import StatCard from "./StatCard";
import ChartCard from "./ChartCard";
import PopulationPyramid from "./charts/PopulationPyramid";
import GDPChart from "./charts/GDPChart";
import PopulationChart from "./charts/PopulationChart";
import SectorDonut from "./charts/SectorDonut";
import TradeBarChart from "./charts/TradeBarChart";

interface Props {
  country: CountryData;
}

export default function Dashboard({ country }: Props) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 lg:px-6">
      {/* Country header */}
      <div className="mb-6 flex items-baseline gap-4 border-b border-white/10 pb-4">
        <span className="text-4xl">{country.flag}</span>
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white">
            {country.name}
          </h2>
          <p className="font-body text-sm text-white/40">{country.region}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${country.gdpGrowthRate > 0 ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="font-body text-xs text-white/40">
            {country.gdpGrowthRate > 0 ? "Growing" : "Contracting"} Economy
          </span>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid auto-rows-[140px] grid-cols-4 gap-2 lg:grid-cols-6">
        {/* Row 1: Key stats */}
        <div className="col-span-1">
          <StatCard
            label="Population"
            value={formatNumber(country.population)}
            change={country.populationGrowthRate}
            accent="blue"
          />
        </div>
        <div className="col-span-1">
          <StatCard
            label="GDP"
            value={formatCurrency(country.gdp)}
            change={country.gdpGrowthRate}
            accent="green"
          />
        </div>
        <div className="col-span-1">
          <StatCard
            label="GDP Per Capita"
            value={`$${country.gdpPerCapita.toLocaleString()}`}
            accent="green"
          />
        </div>
        <div className="col-span-1">
          <StatCard
            label="Life Expectancy"
            value={country.lifeExpectancy.toFixed(1)}
            suffix="yrs"
            accent="blue"
          />
        </div>
        <div className="col-span-1">
          <StatCard
            label="Median Age"
            value={country.medianAge.toFixed(1)}
            suffix="yrs"
            accent="blue"
          />
        </div>
        <div className="col-span-1">
          <StatCard
            label="HDI Score"
            value={country.hdi.toFixed(3)}
            accent="green"
          />
        </div>

        {/* Row 2-3: GDP Chart (wide) + Population Pyramid */}
        <div className="col-span-4 row-span-2 lg:col-span-3">
          <ChartCard title="GDP Trend (Billions USD)" accent="green" className="h-full">
            <GDPChart data={country.gdpHistory} />
          </ChartCard>
        </div>
        <div className="col-span-4 row-span-2 lg:col-span-3">
          <ChartCard title="Age Distribution" accent="blue" className="h-full">
            <PopulationPyramid data={country.ageDistribution} />
          </ChartCard>
        </div>

        {/* Row 4-5: Population chart + Sector donut + Trade + small stats */}
        <div className="col-span-4 row-span-2 lg:col-span-3">
          <ChartCard
            title="Population Trend"
            accent="blue"
            className="h-full"
          >
            <PopulationChart data={country.populationHistory} />
          </ChartCard>
        </div>

        <div className="col-span-2 row-span-2 lg:col-span-1">
          <ChartCard title="Sectors" accent="green" className="h-full">
            <SectorDonut data={country.topSectors} />
          </ChartCard>
        </div>

        <div className="col-span-2 row-span-2 lg:col-span-2">
          <ChartCard title="Trade Balance" accent="blue" className="h-full">
            <TradeBarChart data={country.tradeBalance} />
          </ChartCard>
        </div>

        {/* Row 6: Social & economic indicators */}
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            label="Urbanization"
            value={`${country.urbanizationRate}%`}
            accent="blue"
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            label="Literacy"
            value={`${country.literacyRate}%`}
            accent="green"
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            label="Unemployment"
            value={`${country.unemploymentRate}%`}
            accent="blue"
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            label="Inflation"
            value={`${country.inflationRate}%`}
            accent="green"
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            label="Birth Rate"
            value={country.birthRate.toFixed(1)}
            suffix="/1K"
            accent="blue"
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            label="Fertility"
            value={country.fertilityRate.toFixed(2)}
            accent="green"
          />
        </div>

        {/* Row 7: More indicators */}
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            label="Death Rate"
            value={country.deathRate.toFixed(1)}
            suffix="/1K"
            accent="blue"
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            label="Net Migration"
            value={`${country.netMigration > 0 ? "+" : ""}${country.netMigration.toFixed(1)}`}
            suffix="/1K"
            accent="blue"
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            label="Gini Index"
            value={country.giniIndex.toFixed(1)}
            accent="green"
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            label="Trade Balance"
            value={`${country.tradeBalance.balance >= 0 ? "+" : ""}$${country.tradeBalance.balance}B`}
            accent={country.tradeBalance.balance >= 0 ? "green" : "blue"}
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            label="Pop. Growth"
            value={`${country.populationGrowthRate > 0 ? "+" : ""}${country.populationGrowthRate}%`}
            accent={country.populationGrowthRate >= 0 ? "green" : "blue"}
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            label="GDP Growth"
            value={`${country.gdpGrowthRate > 0 ? "+" : ""}${country.gdpGrowthRate}%`}
            accent={country.gdpGrowthRate > 0 ? "green" : "blue"}
          />
        </div>
      </div>
    </div>
  );
}
