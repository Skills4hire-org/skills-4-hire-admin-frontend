import { logoutUser, setAccessToken } from '@/features/user/userSlice'
import { store } from '@/store'
import axios from 'axios'
import { isTokenExpired } from './helpers'

let refreshPromise: Promise<string> | null = null

const refreshAccessToken = async (): Promise<string> => {
  if (refreshPromise) return refreshPromise

  const state = store.getState()
  const refreshToken = state.userState.refresh

  if (!refreshToken) {
    store.dispatch(logoutUser())
    throw new Error('No refresh token')
  }

  refreshPromise = new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh/token/`,
        { refresh: refreshToken },
      )

      const newAccess = res.data.access

      store.dispatch(setAccessToken(newAccess))

      resolve(newAccess)
    } catch (err) {
      store.dispatch(logoutUser())
      reject(err)
    } finally {
      refreshPromise = null
    }
  })

  return refreshPromise
}

const getStoredAdminToken = () => {
  const tokenKeys = ["admin_token", "accessToken", "token", "access"]

  for (const key of tokenKeys) {
    const value = localStorage.getItem(key)
    if (value) {
      return value
    }
  }

  return null
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  timeoutErrorMessage:
    'The request timed out. Kindly try again or refresh your page',
})

/* REQUEST INTERCEPTOR */
api.interceptors.request.use(async (config) => {
  const state = store.getState()
  let token = state.userState.access || getStoredAdminToken()

  if (token) {
    if (isTokenExpired(token)) {
      try {
        token = await refreshAccessToken()
      } catch {
        return config // logout already handled
      }
    }

    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* RESPONSE INTERCEPTOR */

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const newAccess = await refreshAccessToken()

        originalRequest.headers.Authorization = `Bearer ${newAccess}`

        return api(originalRequest)
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  },
)
