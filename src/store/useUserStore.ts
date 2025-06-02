import { create } from 'zustand'

interface UserStore {
  userId: number | null
  setUserId: (id: number) => void
  resetUserId: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
  resetUserId: () => set({ userId: null })
}))
