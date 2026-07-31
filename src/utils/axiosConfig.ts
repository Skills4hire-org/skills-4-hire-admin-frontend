/* import { store } from '@/store' */
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000, // 60 seconds
  timeoutErrorMessage:
    'The request timed out. Kindly try again or refresh your page',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

