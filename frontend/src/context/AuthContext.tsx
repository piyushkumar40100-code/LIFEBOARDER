import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import authService from '../services/auth';
import { User, AuthTokens, LoginData, RegisterData } from '../types/Auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing tokens and validate them on app load
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        const storedUser = authService.getUser();
        if (storedUser) {
          dispatch({ type: 'SET_USER', payload: storedUser });
        } else {
          // Tokens exist but no user data, try to refresh
          try {
            await authService.refreshToken();
            // You might want to fetch user data here
            dispatch({ type: 'LOGOUT' });
          } catch (error) {
            dispatch({ type: 'LOGOUT' });
          }
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authService.login(credentials);
      const { user, tokens } = response.data;

      authService.setUser(user);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, tokens }
      });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authService.register(userData);
      const { user, tokens } = response.data;

      authService.setUser(user);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, tokens }
      });
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.clearUser();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      await authService.refreshToken();
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;