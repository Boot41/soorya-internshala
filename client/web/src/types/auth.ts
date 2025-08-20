export type AuthState = {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
  clear: () => void
}

export type TokenResponse = {
  access_token: string
  token_type: string
}

export type RegisterResponse = {
  message: string
  user_id: number
}