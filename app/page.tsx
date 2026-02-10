"use client";

import { useCallback, useState } from "react";
import { SexBarChart } from "@/components/charts/SexBarChart";

interface PopulationRecord {
  ID: number;
  Location: string;
  Time: number;
  Variant: string;
  PopMale: number;
  PopFemale: number;
  PopTotal: number;
  PopDensity: number;
}

export default function Home() {
  const [data, setData] = useState<PopulationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [location, setLocation] = useState("");
  const [year, setYear] = useState("");

  const handleSearch = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (location)
      params.set(
        "location",
        location.replace(/^./, location[0].toUpperCase()).trim(),
      );
    if (year) params.set("time", year);

    fetch(`/api/countries?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setError(json.error);
        } else {
          setError(null);
          setData(json);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [location, year]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">
        Population by Sex — {data.length} records
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-3 py-2 border border-foreground/20 rounded-md bg-background text-foreground w-64"
        />
        <input
          type="text"
          placeholder="Search by year..."
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-3 py-2 border border-foreground/20 rounded-md bg-background text-foreground w-40"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {loading && <p className="mb-4">Loading...</p>}
      {data.length === 0 && <p className="mb-4"> No Results</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-foreground/20 text-left">
              <th className="py-2 pr-4">Location</th>
              <th className="py-2 pr-4">Variant</th>
              <th className="py-2 pr-4">Year</th>
              <th className="py-2 pr-4 text-right">Male (thousands)</th>
              <th className="py-2 pr-4 text-right">Female (thousands)</th>
              <th className="py-2 pr-4 text-right">Total (thousands)</th>
              <th className="py-2 text-right">Density</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 100).map((row) => (
              <tr
                key={row.ID}
                className="border-b border-foreground/10 hover:bg-foreground/5"
              >
                <td className="py-1.5 pr-4">{row.Location}</td>
                <td className="py-1.5 pr-4">{row.Variant}</td>
                <td className="py-1.5 pr-4">{row.Time}</td>
                <td className="py-1.5 pr-4 text-right">
                  {row.PopMale?.toLocaleString()}
                </td>
                <td className="py-1.5 pr-4 text-right">
                  {row.PopFemale?.toLocaleString()}
                </td>
                <td className="py-1.5 pr-4 text-right">
                  {row.PopTotal?.toLocaleString()}
                </td>
                <td className="py-1.5 text-right">
                  {row.PopDensity?.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 100 && (
          <p className="mt-4 text-sm text-foreground/50">
            Showing first 100 of {data.length} records
          </p>
        )}
      </div>

      <SexBarChart data={data} />
    </div>
  );
}
