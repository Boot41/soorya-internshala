import api from '@/api/client'
import { getErrorMessage } from '@/utils/error'

export async function uploadProfilePicture(file: File): Promise<string> {
  try {
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post<{ url?: string }>(
      '/files/upload/profile',
      form
    )
    const url = data?.url
    if (!url) throw new Error('No URL returned from server')
    return url
  } catch (err) {
    console.error('[uploadProfilePicture]', err)
    throw new Error(getErrorMessage(err))
  }
}
