"use client";

import { create } from "zustand";

interface LocationStore {
  searchedLocation: string;
  setSearchedLocation: (newLocation: string) => void;
}

const useLocationStore = create<LocationStore>((set) => ({
  searchedLocation: "",
  setSearchedLocation: (newLocation) => set({ searchedLocation: newLocation }),
}));

export default useLocationStore;
