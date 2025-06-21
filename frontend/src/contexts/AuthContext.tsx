
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AuthState, LoginCredentials, RegisterData, User } from "@/types";

// Mock API for now - would be replaced with actual API calls
const mockLogin = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (credentials.email === "admin@example.com" && credentials.password === "password") {
    return {
      user: {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin"
      },
      token: "mock-jwt-token-admin"
    };
  }
  
  if (credentials.email === "user@example.com" && credentials.password === "password") {
    return {
      user: {
        id: "2",
        name: "Regular User",
        email: "user@example.com",
        role: "user"
      },
      token: "mock-jwt-token-user"
    };
  }
  
  throw new Error("Invalid credentials");
};

const mockRegister = async (data: RegisterData): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock registration (in a real app, this would create a new user)
  return {
    user: {
      id: "3",
      name: data.name,
      email: data.email,
      role: "user"
    },
    token: "mock-jwt-token-new-user"
  };
};

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
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

  // Check for saved token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      try {
        setAuthState({
          user: JSON.parse(user),
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Session expired. Please log in again.",
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user, token } = await mockLogin(credentials);
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
      
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user, token } = await mockRegister(data);
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.name}!`,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Registration failed",
      }));
      
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
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
