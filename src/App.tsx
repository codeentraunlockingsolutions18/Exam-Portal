
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context Providers
import { AuthProvider } from "@/contexts/AuthContext";
import { QuizProvider } from "@/contexts/QuizContext";

// Layouts
import MainLayout from "@/components/layouts/MainLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import AdminLayout from "@/components/layouts/AdminLayout";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import QuizDetails from "@/pages/QuizDetails";
import QuizTaking from "@/pages/QuizTaking";
import QuizResult from "@/pages/QuizResult";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminQuizEdit from "@/pages/AdminQuizEdit";
import AdminUserManagement from "@/pages/AdminUserManagement";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <QuizProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                
                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
                
                {/* Protected Routes */}
                <Route element={<ProtectedLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/quiz/:quizId" element={<QuizDetails />} />
                  <Route path="/quiz/:quizId/take" element={<QuizTaking />} />
                  <Route path="/quiz/:quizId/result" element={<QuizResult />} />
                  
                  {/* Admin Routes */}
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/quiz/:quizId" element={<AdminQuizEdit />} />
                    <Route path="/admin/users" element={<AdminUserManagement />} />
                  </Route>
                </Route>
                
                {/* Not Found */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </TooltipProvider>
        </QuizProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
