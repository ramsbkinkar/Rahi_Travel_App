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

export interface Post {
  id: number;
  caption: string;
  location: string;
  image_url: string;
  likes_count: number;
  created_at: string;
  user_id: number;
  username: string;
  avatar_url: string;
  comments_count: number;
  tags: string[];
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  username: string;
  avatar_url: string;
}

interface PostsResponse {
  status: 'success' | 'error';
  data?: Post[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  message?: string;
}

interface PostResponse {
  status: 'success' | 'error';
  data?: Post;
  message?: string;
}

interface CommentsResponse {
  status: 'success' | 'error';
  data?: Comment[];
  message?: string;
}

interface LikeResponse {
  status: 'success' | 'error';
  data?: {
    action: 'liked' | 'unliked';
    likes_count: number;
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

  // Social feed methods
  async getPosts(page = 1, limit = 10): Promise<PostsResponse> {
    try {
      const response: AxiosResponse<PostsResponse> = await axiosInstance.get('/posts', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }
  }

  async getPost(postId: number): Promise<PostResponse> {
    try {
      const response: AxiosResponse<PostResponse> = await axiosInstance.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch post ${postId}:`, error);
      throw error;
    }
  }

  async createPost(
    caption: string, 
    location: string,
    imageBase64: string,
    tags: string[]
  ): Promise<PostResponse> {
    try {
      // First upload the image
      const uploadResponse: AxiosResponse<any> = await axiosInstance.post('/uploads/image', {
        image: imageBase64,
        folder: 'posts'
      });

      if (uploadResponse.data.status !== 'success') {
        throw new Error('Failed to upload image');
      }

      const image_url = uploadResponse.data.data.image_url;
      const user_id = parseInt(localStorage.getItem('authToken') || '0');

      // Then create the post with the image URL
      const response: AxiosResponse<PostResponse> = await axiosInstance.post('/posts', {
        caption,
        location,
        image_url,
        tags,
        user_id
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  }

  async likePost(postId: number): Promise<LikeResponse> {
    try {
      const user_id = parseInt(localStorage.getItem('authToken') || '0');
      const response: AxiosResponse<LikeResponse> = await axiosInstance.post(`/posts/${postId}/like`, { user_id });
      return response.data;
    } catch (error) {
      console.error(`Failed to like/unlike post ${postId}:`, error);
      throw error;
    }
  }

  async getComments(postId: number): Promise<CommentsResponse> {
    try {
      const response: AxiosResponse<CommentsResponse> = await axiosInstance.get(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
      throw error;
    }
  }

  async addComment(postId: number, content: string): Promise<{ status: string; data?: Comment }> {
    try {
      const user_id = parseInt(localStorage.getItem('authToken') || '0');
      const response: AxiosResponse<{ status: string; data?: Comment }> = await axiosInstance.post(
        `/posts/${postId}/comment`, 
        { user_id, content }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to add comment to post ${postId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;