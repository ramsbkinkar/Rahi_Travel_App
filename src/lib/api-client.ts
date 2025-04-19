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
    // Mock data for testing
    const mockCities: Record<string, City> = {
      'delhi': {
        id: 'delhi',
        name: 'Delhi',
        description: 'Delhi, India\'s capital territory, is a massive metropolitan area in the country\'s north. In Old Delhi, a neighborhood dating to the 1600s, stands the imposing Mughal-era Red Fort, a symbol of India, and the sprawling Jama Masjid mosque, whose courtyard accommodates 25,000 people.',
        image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
        best_time_to_visit: 'October to March',
        highlights: ['Red Fort', 'Qutub Minar', 'India Gate', 'Humayun\'s Tomb', 'Lotus Temple'],
      },
      'mumbai': {
        id: 'mumbai',
        name: 'Mumbai',
        description: 'Mumbai (formerly called Bombay) is a densely populated city on India\'s west coast. A financial center, it\'s India\'s largest city. On the Mumbai Harbour waterfront stands the iconic Gateway of India stone arch, built in the early 20th century.',
        image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f',
        best_time_to_visit: 'November to February',
        highlights: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Colaba Causeway', 'Juhu Beach'],
      },
      'kolkata': {
        id: 'kolkata',
        name: 'Kolkata',
        description: 'Kolkata (formerly Calcutta) is the capital of India\'s West Bengal state. Founded as an East India Company trading post, it was India\'s capital under the British Raj from 1773-1911. Today it\'s known for its grand colonial architecture, art galleries and cultural festivals.',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8AuReW6jMN1DH1PVjYlVEbzWDLUBW5EGLzQ&s',
        best_time_to_visit: 'October to March',
        highlights: ['Victoria Memorial', 'Howrah Bridge', 'Park Street', 'Indian Museum', 'Dakshineswar Kali Temple'],
      },
    };

    // Return mock data if available, otherwise return default "not found" data
    return mockCities[slug] || {
      id: slug,
      name: 'City Not Found',
      description: 'City information is currently unavailable.',
      image_url: '/placeholder.svg',
      best_time_to_visit: 'Information not available',
      highlights: [],
    };
  }
}

export const apiClient = new ApiClient(); 