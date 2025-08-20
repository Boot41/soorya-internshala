export type AuthState = {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
  clear: () => void
}