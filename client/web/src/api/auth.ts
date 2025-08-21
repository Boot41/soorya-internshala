// client/web/src/api/auth.ts
import api from "@/api/client"
import { getErrorMessage } from "@/utils/error"
import type { LoginPayload, RegisterPayload } from "@/schema/auth"
import type { RegisterResponse, TokenResponse } from "@/types/auth"

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  try {
    const { data } = await api.post<RegisterResponse>("/auth/register", payload)
    return data
  } catch (err) {
    console.error("[register]", err)
    throw new Error(getErrorMessage(err))
  }
}

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  try {
    const { data } = await api.post<TokenResponse>("/auth/login", payload)
    return data
  } catch (err) {
    console.error("[login]", err)
    throw new Error(getErrorMessage(err))
  }
}

export async function refresh(): Promise<TokenResponse> {
  try {
    const { data } = await api.post<TokenResponse>("/auth/refresh")
    return data
  } catch (err) {
    console.error("[refresh]", err)
    throw new Error(getErrorMessage(err))
  }
}

export async function logout(): Promise<{ message: string }> {
  try {
    const { data } = await api.post<{ message: string }>("/auth/logout")
    return data
  } catch (err) {
    console.error("[logout]", err)
    throw new Error(getErrorMessage(err))
  }
}