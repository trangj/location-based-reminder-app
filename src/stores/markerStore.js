import create from 'zustand'

export const useMarkerStore = create((set) => ({
  markers: [],
  setMarkers: (markers) => set({ markers }),
}))