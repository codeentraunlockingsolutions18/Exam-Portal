
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { authState, logout } = useAuth();
  const { isAuthenticated, user } = authState;

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-quiz-blue">ExamEntra</Link>
        
        <nav className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-quiz-blue font-medium">
                Dashboard
              </Link>
              
              {user?.role === "admin" && (
                <Link to="/admin" className="text-gray-700 hover:text-quiz-blue font-medium">
                  Admin
                </Link>
              )}
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
