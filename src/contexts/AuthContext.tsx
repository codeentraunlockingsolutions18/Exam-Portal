
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { User, LoginCredentials, RegisterData, AuthState } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/services/supabaseService";

interface AuthContextProps {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
}

const defaultAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextProps>({
  authState: defaultAuthState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  sendOTP: async () => {},
  verifyOTP: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Setup auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event);
            
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              if (session) {
                // Fetch user profile data
                const user = await getCurrentUser();
                
                setAuthState({
                  user,
                  token: session.access_token,
                  isAuthenticated: true,
                  isLoading: false,
                  error: null,
                });
              }
            } else if (event === 'SIGNED_OUT') {
              setAuthState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
            }
          }
        );

        // Check current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const user = await getCurrentUser();
          
          setAuthState({
            user,
            token: session.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }

        return () => {
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: "Failed to initialize authentication" 
        }));
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      // The session update will be handled by the onAuthStateChange listener
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error.message || "Invalid credentials" 
      }));
      
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Supabase signup with user metadata
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            courseId: data.courseId,
            role: 'user', // Default role
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account",
      });
      
      navigate('/login');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: error.message || "Registration failed" 
      }));
      
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      
      // The session update will be handled by the onAuthStateChange listener
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate('/login');
      
    } catch (error: any) {
      console.error('Logout error:', error);
      
      toast({
        title: "Logout failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };
  
  // OTP functions for email verification
  const sendOTP = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Send OTP error:', error);
      throw error;
    }
  };
  
  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      // Supabase handles email verification via the link sent in email
      // OTP is not directly supported, this is a placeholder
      return true;
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        register,
        logout,
        sendOTP,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
