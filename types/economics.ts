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
