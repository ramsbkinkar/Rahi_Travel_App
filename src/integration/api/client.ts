import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear token on authentication error
      localStorage.removeItem('authToken');
    }
    // Extract the error message from the response
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

interface AuthResponse {
  status: 'success' | 'error';
  data?: {
    user: {
      id: number;
      email: string;
      name: string;
    };
  };
  message?: string;
}

class ApiClient {
  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post('/auth/signup', {
        name,
        email,
        password
      });
      if (response.data.status === 'success' && response.data.data?.user) {
        localStorage.setItem('authToken', response.data.data.user.id.toString());
      }
      return response.data;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axiosInstance.post('/auth/login', {
        email,
        password
      });
      if (response.data.status === 'success' && response.data.data?.user) {
        localStorage.setItem('authToken', response.data.data.user.id.toString());
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;