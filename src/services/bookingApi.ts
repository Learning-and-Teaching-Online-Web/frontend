import axiosClient from './axiosClient';

export const bookingApi = {
  create: async (data: { courseId: string; scheduleId?: string; notes?: string }) => {
    const response = await axiosClient.post('/bookings', data);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await axiosClient.get('/bookings/my-bookings');
    return response.data;
  },

  getWallet: async () => {
    const response = await axiosClient.get('/bookings/student/wallet');
    return response.data;
  },

  depositWallet: async (amount: number) => {
    const response = await axiosClient.post('/bookings/student/wallet/deposit', { amount });
    return response.data;
  },

  payBooking: async (bookingId: string) => {
    const response = await axiosClient.post(`/bookings/${bookingId}/pay`);
    return response.data;
  }
};
export default bookingApi;
