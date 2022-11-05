import AsyncStorage from '@react-native-async-storage/async-storage'
import create from 'zustand'
import { persist } from 'zustand/middleware'

const markerStore = (set) => ({
  markers: [],
  setMarkers: (markers) => set({ markers }),
})

export const useMarkerStore = create(
  persist(markerStore, {
    name:  'markers',
    getStorage: () => AsyncStorage 
  })
)