import create from 'zustand'

export const useRemindersStore = create((set) => ({
  reminders: [],
  setReminders: (reminders) => set({ reminders }),
}))
