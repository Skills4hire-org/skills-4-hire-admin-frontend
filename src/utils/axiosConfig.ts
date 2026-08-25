/* import { store } from '@/store' */
import axios from 'axios'

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
  timeout: 60000, // 60 seconds
  timeoutErrorMessage:
    'The request timed out. Kindly try again or refresh your page',
})

api.interceptors.request.use((config) => {
  const token = getStoredAdminToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

