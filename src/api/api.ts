import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7205';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Thêm interceptor để gắn Token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response tập trung
api.interceptors.response.use(
  (response) => {
    // Nếu response có cấu trúc { success, data, message, ... }
    if (response.data && Object.prototype.hasOwnProperty.call(response.data, 'success')) {
      if (response.data.success) {
        // Trả về phần data thực sự để component sử dụng trực tiếp
        return { ...response, data: response.data.data };
      } else {
        // Xử lý khi success: false (nếu cần)
        return Promise.reject(response.data.message || 'Có lỗi xảy ra');
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
