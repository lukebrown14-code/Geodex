"use client";

import { create } from "zustand";

const MAX_TABS = 8;

interface LocationStore {
  searchedLocation: string;
  openCountries: string[];
  activeCountry: string;
  comparisonCountry: string | null;
  setSearchedLocation: (newLocation: string) => void;
  addCountry: (country: string) => void;
  removeCountry: (country: string) => void;
  setActiveCountry: (country: string) => void;
  setComparisonCountry: (country: string) => void;
  clearComparison: () => void;
  reset: () => void;
}

const useLocationStore = create<LocationStore>((set, get) => ({
  searchedLocation: "",
  openCountries: [],
  activeCountry: "",
  comparisonCountry: null,

  addCountry: (country) => {
    const { openCountries } = get();
    // If already open, just activate it
    if (openCountries.includes(country)) {
      set({ activeCountry: country, searchedLocation: country });
      return;
    }
    // Max tabs check
    if (openCountries.length >= MAX_TABS) return;
    set({
      openCountries: [...openCountries, country],
      activeCountry: country,
      searchedLocation: country,
    });
  },

  removeCountry: (country) => {
    const { openCountries, activeCountry, comparisonCountry } = get();
    const newOpen = openCountries.filter((c) => c !== country);
    const clearComp = comparisonCountry === country ? null : comparisonCountry;
    if (newOpen.length === 0) {
      set({ openCountries: [], activeCountry: "", searchedLocation: "", comparisonCountry: null });
      return;
    }
    if (activeCountry === country) {
      const oldIndex = openCountries.indexOf(country);
      const newActive = newOpen[Math.min(oldIndex, newOpen.length - 1)];
      set({
        openCountries: newOpen,
        activeCountry: newActive,
        searchedLocation: newActive,
        comparisonCountry: clearComp,
      });
    } else {
      set({ openCountries: newOpen, comparisonCountry: clearComp });
    }
  },

  setActiveCountry: (country) => {
    set({ activeCountry: country, searchedLocation: country });
  },

  setComparisonCountry: (country) => {
    const { activeCountry, comparisonCountry } = get();
    if (country === activeCountry) return;
    set({ comparisonCountry: comparisonCountry === country ? null : country });
  },

  clearComparison: () => {
    set({ comparisonCountry: null });
  },

  // Delegates to addCountry so Header needs no changes
  setSearchedLocation: (newLocation) => {
    get().addCountry(newLocation);
  },

  reset: () => {
    set({ searchedLocation: "", openCountries: [], activeCountry: "", comparisonCountry: null });
  },
}));

export default useLocationStore;
