"use client";

import { create } from "zustand";

const MAX_TABS = 8;

interface LocationStore {
  searchedLocation: string;
  openCountries: string[];
  activeCountry: string;
  setSearchedLocation: (newLocation: string) => void;
  addCountry: (country: string) => void;
  removeCountry: (country: string) => void;
  setActiveCountry: (country: string) => void;
}

const useLocationStore = create<LocationStore>((set, get) => ({
  searchedLocation: "",
  openCountries: [],
  activeCountry: "",

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
    const { openCountries, activeCountry } = get();
    const newOpen = openCountries.filter((c) => c !== country);
    if (newOpen.length === 0) {
      set({ openCountries: [], activeCountry: "", searchedLocation: "" });
      return;
    }
    // If we're closing the active tab, activate an adjacent one
    if (activeCountry === country) {
      const oldIndex = openCountries.indexOf(country);
      const newActive = newOpen[Math.min(oldIndex, newOpen.length - 1)];
      set({
        openCountries: newOpen,
        activeCountry: newActive,
        searchedLocation: newActive,
      });
    } else {
      set({ openCountries: newOpen });
    }
  },

  setActiveCountry: (country) => {
    set({ activeCountry: country, searchedLocation: country });
  },

  // Delegates to addCountry so Header needs no changes
  setSearchedLocation: (newLocation) => {
    get().addCountry(newLocation);
  },
}));

export default useLocationStore;
