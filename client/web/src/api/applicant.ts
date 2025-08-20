import api from '@/api/client'
import type { UpdateUserProfile, UserProfileApplicantResponse } from '@/types/applicant'
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

export async function updateApplicantProfile(payload: UpdateUserProfile) {
  try {
    const res = await api.put<UserProfileApplicantResponse>('/users/me', payload)
    return res.data
  } catch (err) {
    console.error('[updateApplicantProfile]', err)
    throw new Error(getErrorMessage(err))
  }
}
