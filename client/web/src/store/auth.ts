import { create } from "zustand"
import type { AuthState } from "@/types/auth"

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (token: string | null) => set({ accessToken: token }),
  clear: () => set({ accessToken: null }),
}))

export const authStore = {
  get token() {
    return useAuthStore.getState().accessToken
  },
  set token(value: string | null) {
    useAuthStore.getState().setAccessToken(value)
  },
  clear() {
    useAuthStore.getState().clear()
  },
}
