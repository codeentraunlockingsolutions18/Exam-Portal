
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AuthState, LoginCredentials, RegisterData, User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  
  const { toast } = useToast();

  // Check for active session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Set up auth state listener first
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session) {
            const user: User = {
              id: session.user.id,
              name: session.user.user_metadata.name || "",
              email: session.user.email || "",
              role: session.user.user_metadata.role || "user",
              courseId: session.user.user_metadata.courseId,
              courseName: session.user.user_metadata.courseName,
            };
            
            setAuthState({
              user,
              token: session.access_token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
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

      // Then check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const user: User = {
          id: session.user.id,
          name: session.user.user_metadata.name || "",
          email: session.user.email || "",
          role: session.user.user_metadata.role || "user",
          courseId: session.user.user_metadata.courseId,
          courseName: session.user.user_metadata.courseName,
        };
        
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
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      // The session will be handled by the onAuthStateChange listener
      
      toast({
        title: "Logged in successfully",
        description: `Welcome back!`,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || "Login failed",
      }));
      
      toast({
        title: "Login failed",
        description: error?.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            courseId: data.courseId,
            role: "user",
          },
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${data.name}! Please verify your email to continue.`,
      });

      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || "Registration failed",
      }));
      
      toast({
        title: "Registration failed",
        description: error?.message || "Could not create account",
        variant: "destructive",
      });
    }
  };

  // Send OTP for email verification
  const sendOTP = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/register`,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification code sent",
        description: `A verification code has been sent to ${email}`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to send verification code",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const verifyOTP = async (email: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      toast({
        title: "OTP verification failed",
        description: "Invalid or expired code",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    // The session will be handled by the onAuthStateChange listener
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      authState, 
      login, 
      register, 
      logout,
      sendOTP,
      verifyOTP
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
