"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import { censusApi } from "@/lib/api";

export default function CountrySearch() {
  const [results, setResults] = useState<string[][]>([]);
  const [population, setPopulation] = useState<string>("");

  const handleSearch = async (query: string) => {
    const data = await censusApi.getPopulation("2025", query);
    setPopulation(data[1][0]);
    setResults(data);
  };

  return (
    <div>
      <SearchBar onSearchAction={handleSearch} />
      <h2>Country Population: {population}</h2>
      <ul>
        {results.map((d, index) => (
          <li key={index}>{d[0]}</li>
        ))}
      </ul>
    </div>
  );
}
