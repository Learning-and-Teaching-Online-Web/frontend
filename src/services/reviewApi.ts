import axiosClient from './axiosClient';

export const reviewApi = {
  getVisible: async () => {
    const response = await axiosClient.get('/reviews/visible');
    return response.data;
  },

  createReview: async (data: {
    booking_id: string;
    rating: number;
    professionalism?: number;
    communication?: number;
    punctuality?: number;
    comment?: string;
  }) => {
    const response = await axiosClient.post('/reviews', data);
    return response.data;
  }
};
export default reviewApi;
