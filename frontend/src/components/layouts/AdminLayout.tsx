
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AdminLayout = () => {
  // const { authState } = useAuth();
  // const { user, isAuthenticated, isLoading } = authState;
  
  // // Show loading state
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }
  
  // // Redirect if not authenticated or not an admin
  // if (!isAuthenticated || user?.role !== "admin") {
  //   return <Navigate to="/" replace />;
  // }
  
  return <Outlet />;
};

export default AdminLayout;
