"use client";

import { useEffect, useState } from "react";

export function useCountries() {
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/countries")
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) {
          setCountries(json);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { countries, loading };
}
