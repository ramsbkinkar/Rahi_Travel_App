const API_BASE_URL = 'http://localhost:3000/api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  data?: {
    user: User;
  };
  message?: string;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  location: string;
  duration_days: number;
  price: number;
  category: string;
  images: string[];
  itinerary: string[];
  inclusions: string[];
  exclusions: string[];
}

export interface City {
  id: string;
  name: string;
  description: string;
  image_url: string;
  best_time_to_visit: string;
  highlights: string[];
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new ApiError(response.status, error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async signIn(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        ...this.defaultHeaders,
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const data = await this.handleResponse<AuthResponse>(response);
    
    if (data.status === 'error' || !data.data?.user) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data.user;
  }

  async signUp(name: string, email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        ...this.defaultHeaders,
      },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include',
    });

    const data = await this.handleResponse<AuthResponse>(response);
    
    if (data.status === 'error' || !data.data?.user) {
      throw new Error(data.message || 'Signup failed');
    }

    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data.user;
  }

  async signOut(): Promise<void> {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  async getPackages(params?: { category?: string; minPrice?: number; maxPrice?: number }): Promise<Package[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.set('category', params.category);
      if (params?.minPrice) queryParams.set('minPrice', params.minPrice.toString());
      if (params?.maxPrice) queryParams.set('maxPrice', params.maxPrice.toString());

      const response = await fetch(`${API_BASE_URL}/packages?${queryParams.toString()}`, {
        headers: {
          ...this.defaultHeaders,
          ...this.getAuthHeader(),
        },
        credentials: 'include',
      });

      return this.handleResponse<Package[]>(response);
    } catch (error) {
      console.error('Error fetching packages:', error);
      return [];
    }
  }

  async getPackageById(id: string): Promise<Package> {
    const response = await fetch(`${API_BASE_URL}/packages/${id}`, {
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
      },
      credentials: 'include',
    });

    return this.handleResponse<Package>(response);
  }

  async createPackage(packageData: Omit<Package, 'id'>): Promise<Package> {
    const response = await fetch(`${API_BASE_URL}/packages`, {
      method: 'POST',
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(packageData),
      credentials: 'include',
    });

    return this.handleResponse<Package>(response);
  }

  async getCityDetails(slug: string): Promise<City> {
    try {
      const response = await fetch(`${API_BASE_URL}/cities/${slug}`, {
        headers: {
          ...this.defaultHeaders,
          ...this.getAuthHeader(),
        },
        credentials: 'include',
      });

      return this.handleResponse<City>(response);
    } catch (error) {
      console.error('Error fetching city details:', error);
      return {
        id: slug,
        name: 'City Not Found',
        description: 'City information is currently unavailable.',
        image_url: '/placeholder.svg',
        best_time_to_visit: 'Information not available',
        highlights: [],
      };
    }
  }
}

export const apiClient = new ApiClient(); 