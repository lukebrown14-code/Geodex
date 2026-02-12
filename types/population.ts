export interface PopulationRecord {
  ID: number;
  Location: string;
  Time: number;
  Variant: string;
  AgeGrp: string;
  PopMale: number;
  PopFemale: number;
  PopTotal: number;
  PopDensity: number;
}

export interface PyramidData {
  age: string;
  male: number;
  female: number;
}

export interface MedianData {
  Time: number;
  MedianAgePop: number;
  TFR: number;
  NetMigrations: number;
  InfantDeaths: number;
  LEx: number;
  CBR: number;
  CDR: number;
  PopDensity: number;
  TPopulation1July: number;
}

export interface EconomicData {
  index: number;
  country_name: string;
  country_id: string;
  year: number;
  "Inflation (CPI %)": number | null;
  "GDP (Current USD)": number | null;
  "GDP per Capita (Current USD)": number | null;
  "Unemployment Rate (%)": string | null;
  "Interest Rate (Real, %)": number | null;
  "Inflation (GDP %)": number | null;
  "GDP Growth (% Annual)": number | null;
  "Current Account Balance (% GDP)": number | null;
  "Government Expense (% of GDP)": string | null;
  "Government Revenue (% of GDP)": string | null;
  "Tax Revenue (% of GDP)": string | null;
  "Gross National Income (USD)": number | null;
  "Public Debt (% of GDP)": string | null;
}
