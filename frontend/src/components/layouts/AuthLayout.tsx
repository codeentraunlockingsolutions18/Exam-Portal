
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthLayout = () => {
  const { authState } = useAuth();
  
  // If already authenticated, redirect to dashboard
  if (authState.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
