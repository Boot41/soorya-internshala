import api from '@/api/client'
import type { UpdateUserProfile, UserProfileApplicantResponse, ApplicantBasicsPayload } from '@/types/applicant'
import { getErrorMessage } from '@/utils/error'


export async function getApplicantMe() {
  try {
    const res = await api.get<UserProfileApplicantResponse>('/users/me')
    return res.data
  } catch (err) {
    console.error('[getApplicantMe]', err)
    throw new Error(getErrorMessage(err))
  }
}

export async function getApplicantById(applicantId: string) {
  try {
    const res = await api.get<UserProfileApplicantResponse>(`/users/${applicantId}`)
    return res.data
  } catch (err) {
    console.error('[getApplicantById]', err)
    throw new Error(getErrorMessage(err))
  }
}

export async function updateApplicantProfile(payload: UpdateUserProfile) {
  try {
    const res = await api.put<UserProfileApplicantResponse>('/users/me', payload)
    return res.data
  } catch (err) {
    console.error('[updateApplicantProfile]', err)
    throw new Error(getErrorMessage(err))
  }
}

export async function updateApplicantBasics(payload: ApplicantBasicsPayload) {
  try {
    // Server currently returns a message; we don't rely on the response shape here
    await api.put('/users/me', payload)
  } catch (err) {
    console.error('[updateApplicantBasics]', err)
    throw new Error(getErrorMessage(err))
  }
}
