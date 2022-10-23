import create from 'zustand'

export const useSessionStore = create((set) => ({
  session: null,
  user: null,
  setSession: (session) => set({ session: session, user: session ? session.user : null }),
}))
