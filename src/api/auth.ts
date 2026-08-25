import { api } from '@/utils/axiosConfig'
import { handleApiError } from './error'
import type {
  LoginPayload,
  OnboardPayload,
  RegisterPayload,
  ResendOtpPayload,
  VerifyOtpPayload,
  PasswordResetRequestPayload,
  PasswordResetConfirmPayload,
} from '@/types/auth.types'

export const login = async (data: LoginPayload) => {
  try {
    const response = await api.post('/api/v1/auth/login/', data)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const adminLogin = async (data: LoginPayload) => {
  try {
    const response = await api.post('/api/admin/login/', data)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const register = async (data: RegisterPayload) => {
  try {
    const response = await api.post('/api/v1/auth/register/', data)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const resendOtp = async (data: ResendOtpPayload) => {
  try {
    const response = await api.post('/api/v1/auth/resend/otp/', data)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const verifyOtp = async (data: VerifyOtpPayload) => {
  try {
    const response = await api.post('/api/v1/auth/verify/', data)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const passwordResetRequest = async (
  data: PasswordResetRequestPayload,
) => {
  try {
    const response = await api.post('/api/v1/auth/password/reset/', data)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const passwordResetConfirm = async (
  data: PasswordResetConfirmPayload,
) => {
  try {
    const response = await api.post(
      '/api/v1/auth/password/reset-confirm/',
      data,
    )
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}

export const onboardRole = async (data: OnboardPayload) => {
  try {
    const response = await api.post('/api/v1/onboard/', data)
    return response?.data
  } catch (error) {
    handleApiError(error)
  }
}
