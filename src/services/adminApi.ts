import axiosClient from './axiosClient';

export const adminApi = {
  // 1. Dashboard Stats
  getStats: async () => {
    const response = await axiosClient.get('/admin/stats');
    return response.data;
  },

  // 2. User Management
  getUsers: async (params: { search?: string; role?: string; status?: string; page?: number; limit?: number }) => {
    const response = await axiosClient.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId: string, status: 'active' | 'suspended' | 'deleted') => {
    const response = await axiosClient.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  updateUserRole: async (userId: string, role: 'student' | 'tutor' | 'admin') => {
    const response = await axiosClient.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // 3. Tutor & Certificate Verification
  getTutors: async (params: { verifiedStatus?: string; page?: number; limit?: number }) => {
    const response = await axiosClient.get('/admin/tutors', { params });
    return response.data;
  },

  updateTutorVerification: async (tutorId: string, status: 'pending' | 'approved' | 'rejected') => {
    const response = await axiosClient.patch(`/admin/tutors/${tutorId}/verify`, { status });
    return response.data;
  },

  getTutorCertificates: async (tutorId: string) => {
    const response = await axiosClient.get(`/admin/tutors/${tutorId}/certificates`);
    return response.data;
  },

  updateCertificateStatus: async (certId: string, status: 'pending' | 'approved' | 'rejected', adminNote?: string) => {
    const response = await axiosClient.patch(`/admin/certificates/${certId}/verify`, { status, adminNote });
    return response.data;
  },

  // 4. Course Moderation
  getCourses: async (params: { search?: string; status?: string; page?: number; limit?: number }) => {
    const response = await axiosClient.get('/admin/courses', { params });
    return response.data;
  },

  updateCourseStatus: async (courseId: string, status: 'draft' | 'published' | 'hidden' | 'archived') => {
    const response = await axiosClient.patch(`/admin/courses/${courseId}/status`, { status });
    return response.data;
  },

  // 5. Payment & Payouts management
  getTransactions: async (params: { page?: number; limit?: number }) => {
    const response = await axiosClient.get('/admin/transactions', { params });
    return response.data;
  },

  getPayouts: async (params: { status?: string; page?: number; limit?: number }) => {
    const response = await axiosClient.get('/admin/payouts', { params });
    return response.data;
  },

  updatePayoutStatus: async (payoutId: string, status: 'pending' | 'processing' | 'completed' | 'failed') => {
    const response = await axiosClient.patch(`/admin/payouts/${payoutId}/status`, { status });
    return response.data;
  }
};
export default adminApi;
