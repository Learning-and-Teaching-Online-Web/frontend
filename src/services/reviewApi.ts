import axiosClient from './axiosClient';

export const reviewApi = {
  getVisible: async () => {
    const response = await axiosClient.get('/reviews/visible');
    return response.data;
  }
};
export default reviewApi;
