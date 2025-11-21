import apiClient from './api';
import { LoginData, RegisterData, AuthResponse } from '../types/Auth';

export const authService = {
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

      // Store tokens in localStorage
      const { accessToken, refreshToken } = response.data.tokens;
      apiClient.setAuthTokens(accessToken, refreshToken);

      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);

      // Store tokens in localStorage
      const { accessToken, refreshToken } = response.data.tokens;
      apiClient.setAuthTokens(accessToken, refreshToken);

      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear tokens locally
      apiClient.clearAuthTokens();
    }
  },

  async refreshToken(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<{ success: boolean; data: { accessToken: string } }>('/auth/refresh', {
        refreshToken,
      });

      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Token refresh failed');
    }
  },

  // Check if user is authenticated (has valid tokens)
  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    return !!(accessToken && refreshToken);
  },

  // Get stored user info
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Store user info
  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear user info
  clearUser() {
    localStorage.removeItem('user');
  },
};

export default authService;