import axios from "axios"
import type { AxiosError, AxiosRequestConfig } from "axios"
import { authStore } from "@/store/auth"

const baseURL = import.meta.env.VITE_BACKEND_URL as string | undefined

if (!baseURL)
    console.warn(
        "[api/client] VITE_BACKEND_URL is not set. Please define it in your .env file."
    )

export const api = axios.create({
    baseURL: baseURL ?? "/api",
    withCredentials: true,
})

export default api

// Attach Authorization header from Zustand store
api.interceptors.request.use((config) => {
    const token = authStore.token
    if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Keep a single in-flight refresh promise to avoid stampedes
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
    if (!refreshPromise) {
        // Use a plain axios call without our interceptors to avoid loops
        refreshPromise = axios
            .post("/auth/refresh", undefined, { baseURL: baseURL ?? "/api", withCredentials: true })
            .then((res) => {
                const newToken: string | undefined = res.data?.access_token ?? res.data?.accessToken
                if (newToken) {
                    authStore.token = newToken
                    return newToken
                }
                return null
            })
            .catch(() => {
                // Clear token on refresh failure
                authStore.clear()
                return null
            })
            .finally(() => {
                refreshPromise = null
            })
    }
    return refreshPromise
}

// Response interceptor to handle 401 and retry once
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined
        const status = error.response?.status

        // Avoid retry loop for the refresh endpoint itself
        const isRefreshCall = (original?.url ?? "").endsWith("/auth/refresh")

        if (status === 401 && original && !original._retry && !isRefreshCall) {
            original._retry = true
            const newToken = await refreshAccessToken()
            if (newToken) {
                original.headers = original.headers ?? {};
                (original.headers as any).Authorization = `Bearer ${newToken}`
                return api.request(original)
            }
        }
        return Promise.reject(error)
    }
)
