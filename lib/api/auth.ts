import api from './axios';

// Interfaces for data types
interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    personalToken: string;
  };
}

type UserProfile = AuthResponse['user'];

// Authentication API
export const authAPI = {
  // Register a new user
  register: async (data: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/auth/profile');
    return response.data;
  },

  // Logout (only removes token from localStorage)
  logout: (): void => {
    localStorage.removeItem('token');
  }
}; 