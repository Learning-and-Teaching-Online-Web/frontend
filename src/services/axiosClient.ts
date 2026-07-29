import axios from 'axios';
import authStorage from '../utils/authStorage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag để tránh nhiều request refresh cùng lúc
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor cho các request (Gửi kèm Access Token nếu có)
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

// Interceptor cho các response (Tự động refresh token khi nhận lỗi 401)
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu nhận lỗi 401 và không phải là request đăng nhập/refresh
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/signin') && !originalRequest.url?.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = authStorage.getRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        handleAuthFailure();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const newAccessToken = data?.data?.access_token;

        if (newAccessToken) {
          authStorage.updateAccessToken(newAccessToken);
          axiosClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          isRefreshing = false;
          return axiosClient(originalRequest);
        } else {
          throw new Error('Refresh token failed to issue access token');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;
        handleAuthFailure();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

function handleAuthFailure() {
  const currentPath = window.location.pathname;
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

export default axiosClient;
