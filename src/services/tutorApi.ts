import axiosClient from './axiosClient';

export const tutorApi = {

  getAll: async () => {
    const response = await axiosClient.get('/tutors');
    return response.data;
  },

  getById: async (tutorId: string) => {
    const response = await axiosClient.get(`/tutors/${tutorId}`);
    return response.data;
  },

  // Stats
  getStats: async () => {
    const res = await axiosClient.get('/tutors/stats');
    return res.data;
  },

  // Courses (My Courses for Tutor)
  getMyCourses: async () => {
    const res = await axiosClient.get('/courses/my-courses');
    return res.data;
  },

  // Create Course
  createCourse: async (data: {
    title: string;
    subject: string;
    price: number;
    level: string;
    duration_minutes: number;
    total_sessions: number;
  }) => {
    const res = await axiosClient.post('/courses', data);
    return res.data;
  },

  // Add Schedule
  addSchedule: async (courseId: string, data: {
    start_time: string;
    end_time: string;
    is_recurring?: boolean;
    day_of_week?: number;
    recurrence_end?: string;
    max_slot?: number;
  }) => {
    const res = await axiosClient.post(`/courses/${courseId}/schedules`, data);
    return res.data;
  },

  // Bookings
  getBookings: async () => {
    const res = await axiosClient.get('/tutors/bookings');
    return res.data;
  },

  // Confirm/Reject Booking
  updateBookingStatus: async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    const res = await axiosClient.patch(`/tutors/bookings/${bookingId}`, { status });
    return res.data;
  },

  // Reviews
  getReviews: async () => {
    const res = await axiosClient.get('/tutors/reviews');
    return res.data;
  },

  // Wallet and Transactions
  getWallet: async () => {
    const res = await axiosClient.get('/tutors/wallet');
    return res.data;
  },

  // Request Payout Withdrawal
  requestWithdrawal: async (data: {
    amount: number;
    bankName: string;
    bankAccount: string;
  }) => {
    const res = await axiosClient.post('/tutors/wallet/withdraw', data);
    return res.data;
  }
};
export default tutorApi;
