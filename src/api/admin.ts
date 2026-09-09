import { api } from "@/utils/axiosConfig";
import { handleApiError } from "./error";

// Bookings
export const getAdminBookings = async (params?: any) => {
  try {
    const response = await api.get("/api/admin/bookings/", { params });
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getAdminBookingDetail = async (id: string) => {
  try {
    const response = await api.get(`/api/admin/bookings/${id}/`);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const patchAdminBooking = async (id: string, data: any) => {
  try {
    const response = await api.patch(`/api/admin/bookings/${id}/`, data);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const approveAdminBooking = async (id: string) => {
  try {
    const response = await api.patch(`/api/admin/bookings/${id}/approve/`);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const refundAdminBooking = async (id: string, data: { refund_percent: number }) => {
  try {
    const response = await api.patch(`/api/admin/bookings/${id}/refund/`, data);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Conversations
export const getAdminConversations = async (params?: any) => {
  try {
    const response = await api.get("/api/admin/conversations/", { params });
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getAdminConversationDetail = async (id: string) => {
  try {
    const response = await api.get(`/api/admin/conversations/${id}/`);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createAdminConversationReply = async (id: string, data: { message: string; [key: string]: any }) => {
  try {
    const response = await api.post(`/api/admin/conversations/${id}/reply/`, data);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Service Categories
export const createAdminService = async (data: any) => {
  try {
    const response = await api.post("/api/admin/service/", data);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateAdminService = async (id: string, data: any) => {
  try {
    const response = await api.put(`/api/admin/service/${id}/`, data);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const patchAdminService = async (id: string, data: any) => {
  try {
    const response = await api.patch(`/api/admin/service/${id}/`, data);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteAdminService = async (id: string) => {
  try {
    const response = await api.delete(`/api/admin/service/${id}/`);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Supports
export const getAdminSupports = async (params?: any) => {
  try {
    const response = await api.get("/api/admin/supports/", { params });
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getAdminSupportDetail = async (id: string) => {
  try {
    const response = await api.get(`/api/admin/supports/${id}/`);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const patchAdminSupport = async (id: string, data: any) => {
  try {
    const response = await api.patch(`/api/admin/supports/${id}/`, data);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const patchAdminSupportAction = async (id: string, adminAction: string, data: any) => {
  try {
    const response = await api.patch(`/api/admin/supports/${id}/${adminAction}/`, data);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const assignAdminSupport = async (id: string, data: any) => {
  try {
    const response = await api.patch(`/api/admin/supports/${id}/assign/`, data);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Users
export const getAdminUsers = async (params?: any) => {
  try {
    const response = await api.get("/api/admin/users/", { params });
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getAdminUserDetail = async (id: string) => {
  try {
    const response = await api.get(`/api/admin/users/${id}/`);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const patchAdminUser = async (id: string, data: any) => {
  try {
    const response = await api.patch(`/api/admin/users/${id}/`, data);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteAdminUser = async (id: string) => {
  try {
    const response = await api.delete(`/api/admin/users/${id}/`);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const patchAdminUserAction = async (id: string, adminAction: string, data: any) => {
  try {
    const response = await api.patch(`/api/admin/users/${id}/${adminAction}/`, data);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteAdminUserAction = async (id: string, adminAction: string) => {
  try {
    const response = await api.delete(`/api/admin/users/${id}/${adminAction}/`);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getAdminUserReferrals = async (id: string) => {
  try {
    const response = await api.get(`/api/admin/users/${id}/referrals/`);
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Referral Withdrawals
export const getAdminReferralWithdrawals = async (params?: any) => {
  try {
    const response = await api.get("/api/admin/referral-withdrawals/", { params });
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const approveAdminReferralWithdrawal = async (id: string, data?: any) => {
  try {
    const response = await api.patch(`/api/admin/referral-withdrawals/${id}/approve/`, data || {});
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const rejectAdminReferralWithdrawal = async (id: string, data?: any) => {
  try {
    const response = await api.patch(`/api/admin/referral-withdrawals/${id}/reject/`, data || {});
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};
