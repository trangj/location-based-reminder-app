import AsyncStorage from '@react-native-async-storage/async-storage'
import create from 'zustand'
import { persist } from 'zustand/middleware'

const groupStore = (set) => ({
  group: null,
  setGroup: (group) => set({ group }),
})

export const useGroupStore = create(
  persist(groupStore, {
    name:  'group',
    getStorage: () => AsyncStorage 
  })
)