import axiosClient from './axiosClient';

export const bookingApi = {
  create: async (data: { courseId: string; scheduleId?: string; notes?: string }) => {
    const response = await axiosClient.post('/bookings', data);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await axiosClient.get('/bookings/my-bookings');
    return response.data;
  }
};
export default bookingApi;
