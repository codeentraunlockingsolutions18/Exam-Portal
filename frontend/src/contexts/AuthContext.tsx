import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { callLoginAPI } from '@/services/authService';

type User = {
  id: string;
  name: string;
  email: string;
  role:'ADMIN' | 'STUDENT';
  courseId?: string;
  courseName?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
};

type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const AuthContext = createContext<{
  authState: AuthState;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}>({
  authState: initialState,
  login: async () => {},
  logout: () => {},
});

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: storedToken,
          user: JSON.parse(storedUser),
        },
      });
    }
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });

      const data = await callLoginAPI({ email, password });

      if (data.status === 'SUCCESS') {
        const { token, user } = data.payload;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: data.responseMsg || 'Authentication failed' });
      }
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Internal server error' });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
