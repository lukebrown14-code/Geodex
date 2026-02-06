export interface AgeDistribution {
  group: string;
  male: number;
  female: number;
}

export interface GDPDataPoint {
  year: number;
  value: number;
}

export interface PopulationDataPoint {
  year: number;
  population: number;
}

export interface TradeBalance {
  exports: number;
  imports: number;
  balance: number;
}

export interface CountryData {
  name: string;
  code: string;
  flag: string;
  region: string;
  population: number;
  populationGrowthRate: number;
  gdp: number;
  gdpPerCapita: number;
  gdpGrowthRate: number;
  lifeExpectancy: number;
  medianAge: number;
  urbanizationRate: number;
  literacyRate: number;
  unemploymentRate: number;
  inflationRate: number;
  birthRate: number;
  deathRate: number;
  fertilityRate: number;
  netMigration: number;
  giniIndex: number;
  hdi: number;
  tradeBalance: TradeBalance;
  ageDistribution: AgeDistribution[];
  gdpHistory: GDPDataPoint[];
  populationHistory: PopulationDataPoint[];
  topSectors: { name: string; percentage: number }[];
}
