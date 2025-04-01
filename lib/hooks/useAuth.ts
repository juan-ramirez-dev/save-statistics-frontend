import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../api/auth';
import { saveToken, getToken, removeToken, parseJwt, checkAndClearExpiredToken } from '../auth';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  personalToken: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load user on init
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if token exists and is not expired
        const wasExpired = checkAndClearExpiredToken();
        if (wasExpired) {
          setLoading(false);
          return;
        }
        
        const token = getToken();
        if (token) {
          // Try to load profile from API
          try {
            const userData = await authAPI.getProfile();
            setUser(userData);
          } catch (error) {
            // Invalid or expired token - API refused request
            removeToken();
          }
        }
      } catch (error) {
        console.error('Error loading user', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login({ email, password });
      setUser(response.user);
      
      // Save token in localStorage and cookies
      saveToken(response.access_token);
      document.cookie = `auth-token=${response.access_token}; path=/; max-age=86400; SameSite=Lax`;
      
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login error');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Register
  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.register({ name, email, password });
      setUser(response.user);
      
      // Save token in localStorage and cookies
      saveToken(response.access_token);
      document.cookie = `auth-token=${response.access_token}; path=/; max-age=86400; SameSite=Lax`;
      
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration error');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    removeToken(); // This also removes cookie
    router.push('/signin');
  }, [router]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout
  };
} 