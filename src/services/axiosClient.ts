import axios from 'axios';
import authStorage from '../utils/authStorage';

// Khởi tạo một instance của axios với các cấu hình mặc định
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho các request (Gửi kèm Token nếu có)
axiosClient.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();
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
    return response;
  },
  (error) => {
    // Xử lý khi token hết hạn hoặc không hợp lệ (401)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Tránh tự động redirect lặp lại nếu đang ở trang auth hoặc admin login
      if (!currentPath.startsWith('/auth') && !currentPath.startsWith('/admin/login')) {
        authStorage.clearAuthSession();
        window.dispatchEvent(new Event('authChange'));
        
        if (currentPath.startsWith('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
