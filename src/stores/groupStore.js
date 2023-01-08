import create from 'zustand'

export const useGroupStore = create((set) => ({
  group: null,
  setGroup: (group) => set({ group }),
}))