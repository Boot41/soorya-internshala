import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { refresh } from '@/api/auth'
import { authStore } from '@/store/auth'

export function StartupAuthRefresh() {
  const { mutateAsync } = useMutation({
    mutationKey: ["auth", "refesh"],
    mutationFn: () => refresh(),
    onSuccess: (data) => {
      if (data?.access_token) 
        authStore.token = data.access_token
    },
  })

  useEffect(() => {
    mutateAsync()
  }, [])

  return null
}
