import axios from 'axios';

// Create axios instance with base URL from environment variables
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add any additional headers if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your internet connection.';
    } else if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 400:
          error.message = 'Bad request. Please check your input.';
          break;
        case 401:
          error.message = 'Unauthorized. Please login again.';
          break;
        case 403:
          error.message = 'Forbidden. You do not have permission to perform this action.';
          break;
        case 404:
          error.message = 'Resource not found.';
          break;
        case 500:
          error.message = 'Server error. Please try again later.';
          break;
        default:
          error.message = 'An error occurred. Please try again.';
      }
    } else if (error.request) {
      // Request was made but no response received
      error.message = 'Network error. Please check your internet connection.';
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const contentAPI = {
  // Submit content
  submitContent: (data) => api.post('/api/content', data),
  
  // Health check
  healthCheck: () => api.get('/api/health'),
};

export default api;
