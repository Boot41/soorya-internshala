import { create } from "zustand"

export type UserCore = {
  userId: string | null
  fullName: string | null
  userType: string | null
}

export type UserStore = UserCore & {
  setUser: (u: UserCore) => void
  clear: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  userId: null,
  fullName: null,
  userType: null,
  setUser: (u) => set(u),
  clear: () => set({ userId: null, fullName: null, userType: null }),
}))

export const userStore = {
  get state() {
    return useUserStore.getState()
  },
  set user(u: UserCore) {
    useUserStore.getState().setUser(u)
  },
  clear() {
    useUserStore.getState().clear()
  },
}
