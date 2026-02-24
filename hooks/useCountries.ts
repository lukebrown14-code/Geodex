"use client";

import { useEffect, useState } from "react";

export function useCountries() {
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/countries")
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) {
          setCountries(json);
        } else {
          setError("Failed to load countries");
        }
      })
      .catch(() => setError("Failed to load countries"))
      .finally(() => setLoading(false));
  }, []);

  return { countries, loading, error };
}
