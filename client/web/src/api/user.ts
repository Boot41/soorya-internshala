import api from "@/api/client"
import { getErrorMessage } from "@/utils/error"
import type { UserMeResponse, UpdateUserProfilePayload } from "@/types/user"

export async function getMe(): Promise<UserMeResponse> {
  try {
    const { data } = await api.get<UserMeResponse>("/users/me")
    return data
  } catch (err) {
    console.error("[getMe]", err)
    throw new Error(getErrorMessage(err))
  }
}

export async function updateMe(payload: UpdateUserProfilePayload): Promise<{ message: string }> {
  try {
    const { data } = await api.put<{ message: string }>("/users/me", payload)
    return data
  } catch (err) {
    console.error("[updateMe]", err)
    throw new Error(getErrorMessage(err))
  }
}
