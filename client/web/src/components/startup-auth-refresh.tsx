import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { refresh } from '@/api/auth'
import { authStore, useAuthStore } from '@/store/auth'
import { getApplicantMe } from '@/api/applicant'
import { userStore } from '@/store/user'

export function StartupAuthRefresh() {
  const { mutateAsync: refreshMutateAsync } = useMutation({
    mutationKey: ["auth", "refesh"],
    mutationFn: () => refresh(),
    onSuccess: (data) => {
      if (data?.access_token) 
        authStore.token = data.access_token
    },
  })

  // Mutation to fetch users/me and store minimal user info
  const { mutateAsync: fetchMeMutate, reset: resetFetchMe } = useMutation({
    mutationKey: ["users", "me"],
    mutationFn: () => getApplicantMe(),
    onSuccess: (me) => {
      userStore.user = {
        userId: me.user_id ?? null,
        fullName: `${me.first_name ?? ''} ${me.last_name ?? ''}`.trim() || null,
        userType: me.user_type ?? null,
      }
    },
    onError: () => {
      userStore.clear()
    },
  })

  useEffect(() => {
    refreshMutateAsync()
  }, [refreshMutateAsync])

  const token = useAuthStore((s) => s.accessToken)
  useEffect(() => {
    if (token) {
      fetchMeMutate()
    } else {
      // clear user state and reset mutation state when logged out
      userStore.clear()
      resetFetchMe()
    }
  }, [token, fetchMeMutate, resetFetchMe])

  console.log({user: userStore.state})

  return null
}
