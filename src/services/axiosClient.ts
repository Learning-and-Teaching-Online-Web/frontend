import axios from 'axios';

// Khởi tạo một instance của axios với các cấu hình mặc định
const axiosClient = axios.create({
  // Sử dụng biến môi trường (environment variables) từ Vite
  // Import.meta.env.VITE_API_BASE_URL sẽ tự động lấy từ file .env hoặc .env.production
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho các request (Gửi kèm Token nếu có)
axiosClient.interceptors.request.use(
  (config) => {
<<<<<<< HEAD:src/services/axiosClient.ts
    // Ví dụ: Lấy token từ localStorage và đính kèm vào header
=======
>>>>>>> 79fef77 (feat: implement teacher dashboard with course management, booking system, and integrated API client):src/api/axiosClient.ts
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho các response (Xử lý lỗi hoặc chuẩn hóa dữ liệu trả về)
axiosClient.interceptors.response.use(
  (response) => {
    // Có thể chỉ trả về response.data nếu BE trả dữ liệu gói trong 'data'
    // return response.data;
    return response;
  },
  (error) => {
    // Xử lý các mã lỗi phổ biến (401, 403, 500,...)
    if (error.response?.status === 401) {
      console.error('Unauthorized! Có thể cần redirect về trang đăng nhập.');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
