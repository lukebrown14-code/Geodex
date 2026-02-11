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
