"use client";

import { useState } from "react";

export default function SearchBar({
  onSearchAction,
}: {
  onSearchAction: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearchAction(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
}
