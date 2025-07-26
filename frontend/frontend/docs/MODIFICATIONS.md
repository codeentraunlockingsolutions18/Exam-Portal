# College Scholarship Exam Portal Modifications

This document provides detailed technical instructions for customizing the MCQ exam portal for college scholarship exams.

## Modifying the Homepage

The homepage needs to be updated to reflect a college scholarship exam portal. Here's what you need to modify:

### Step 1: Update src/pages/Index.tsx

```tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-quiz-blue to-quiz-purple text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              College Scholarship Exam Portal
            </h1>
            <p className="text-xl mb-8">
              Apply for scholarships by demonstrating your knowledge in our online assessments.
              Register, select your course, and take the exam to qualify.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-quiz-purple hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-white hover:bg-white/10">
                  Browse Quizzes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose QuizMaster</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-quiz-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Scholarship Opportunities</h3>
              <p className="text-gray-600">
                Apply for multiple scholarships with a single exam. Top performers receive financial aid.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg shadow-md">
              <div className="bg-purple-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-quiz-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Timed Challenges</h3>
              <p className="text-gray-600">
                Test your knowledge under pressure with our timed quiz challenges.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg shadow-md">
              <div className="bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-quiz-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your performance and improvement over time with detailed statistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Test Your Knowledge?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have improved their skills with our interactive quizzes.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-quiz-blue text-white hover:bg-blue-700">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
```

### Step 2: Update Header and Footer

```tsx
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <img src="/college-logo.svg" alt="College Logo" className="h-8 w-auto mr-2" />
            <span>College Scholarship Portal</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-quiz-blue">Home</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-quiz-blue">Quizzes</Link>
            <Link to="/login" className="text-gray-600 hover:text-quiz-blue">Login</Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

## Adding Course Selection to Registration

The registration process needs to be updated to include course selection.

### Step 1: Update src/pages/Register.tsx

```tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const courses = [
    { id: "cs", name: "Computer Science" },
    { id: "eng", name: "Engineering" },
    { id: "bus", name: "Business Administration" },
    { id: "arts", name: "Liberal Arts" },
    { id: "med", name: "Medical Sciences" }
  ];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const { register, authState } = useAuth();
  const { isLoading, error } = authState;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    await register({ name, email, password, courseId: selectedCourse });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-quiz-blue">Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="course" className="text-sm font-medium">
                Course of Interest
              </label>
              <Select 
                value={selectedCourse}
                onValueChange={(value) => setSelectedCourse(value)}
              >
                <SelectTrigger id="course">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <Button type="submit" disabled={isLoading} className="w-full mt-2">
              {isLoading ? "Creating Account..." : "Register"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-quiz-blue hover:underline">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Register;
```

### Step 2: Update the Authentication Context

```tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  courseId: string;
  courseName: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  courseId: string; // Add courseId field
};

type AuthContextType = {
  authState: AuthState;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to validate the token
        const token = localStorage.getItem("token");
        
        if (token) {
          // Mock user data - in a real app, this would come from the API
          const user = {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "user",
            courseId: "cs",
            courseName: "Computer Science"
          } as User;
          
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Authentication failed",
        });
      }
    };
    
    checkAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // In a real app, this would be an API call
      // Mock successful login
      const user = {
        id: "1",
        name: "John Doe",
        email: data.email,
        role: data.email.includes("admin") ? "admin" : "user",
        courseId: "cs",
        courseName: "Computer Science"
      } as User;
      
      // Store token in localStorage
      localStorage.setItem("token", "mock-token");
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: "Invalid email or password",
      }));
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // In a real app, this would be an API call
      // Mock successful registration
      const user = {
        id: "1",
        name: data.name,
        email: data.email,
        role: "user",
        courseId: data.courseId,
        courseName: getCourseNameById(data.courseId)
      } as User;
      
      // Store token in localStorage
      localStorage.setItem("token", "mock-token");
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: "Registration failed",
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };
  
  // Helper function to get course name by ID
  const getCourseNameById = (courseId: string): string => {
    const courses = {
      "cs": "Computer Science",
      "eng": "Engineering",
      "bus": "Business Administration",
      "arts": "Liberal Arts",
      "med": "Medical Sciences"
    };
    return courses[courseId as keyof typeof courses] || "Unknown Course";
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

## Updating the Dashboard for Course-Specific Quizzes

The dashboard needs to display quizzes relevant to the student's chosen course.

### Step 1: Update src/pages/Dashboard.tsx

```tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/contexts/QuizContext";
import { useAuth } from "@/contexts/AuthContext";
import { Quiz } from "@/types";

const Dashboard = () => {
  const { quizzes, loadQuizzes } = useQuiz();
  const { authState } = useAuth();
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  
  useEffect(() => {
    loadQuizzes().then((allQuizzes) => {
      // Filter quizzes relevant to user's course
      const userCourse = authState.user?.courseId;
      const relevantQuizzes = allQuizzes.filter(quiz => 
        quiz.courseId === userCourse || quiz.courseId === 'all'
      );
      setFilteredQuizzes(relevantQuizzes);
    });
  }, [loadQuizzes, authState.user?.courseId]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {authState.user?.name}</h1>
          <p className="text-gray-600 mt-1">
            Browse available scholarship exams for {authState.user?.courseName}
          </p>
        </div>
        
        {authState.user?.role === "admin" && (
          <Link to="/admin">
            <Button variant="outline">Admin Dashboard</Button>
          </Link>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map(quiz => (
          <Card key={quiz.id} className="quiz-card">
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {quiz.timeLimit} mins
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {quiz.questionCount} questions
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link to={`/quiz/${quiz.id}`} className="w-full">
                <Button className="w-full quiz-button-primary">
                  Start Quiz
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        
        {filteredQuizzes.length === 0 && (
          <div className="col-span-3 text-center py-20">
            <p className="text-gray-500">No quizzes available for your course at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
```

## Admin Quiz Management Enhancements

### Step 1: Update src/pages/AdminQuizEdit.tsx

Enhance the admin quiz edit page to associate quizzes with specific courses:

```tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useQuiz } from "@/contexts/QuizContext";
import { Question, Option } from "@/types";

const AdminQuizEdit = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuiz, getQuizQuestions } = useQuiz();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]
  });
  
  // Load quiz and questions data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        if (!quizId) return;
        
        const quizData = await getQuiz(quizId);
        if (!quizData) {
          toast({ title: "Error", description: "Quiz not found", variant: "destructive" });
          navigate("/admin");
          return;
        }
        
        setQuiz(quizData);
        
        const questionsData = await getQuizQuestions(quizId);
        setQuestions(questionsData);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load quiz data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizData();
  }, [quizId, getQuiz, getQuizQuestions, navigate, toast]);
  
  const handleUpdateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    toast({
      title: "Quiz Updated",
      description: "Quiz details have been updated successfully.",
    });
  };
  
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate question
    if (!newQuestion.text.trim()) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive",
      });
      return;
    }
    
    // Validate options
    const emptyOptions = newQuestion.options.filter(o => !o.text.trim());
    if (emptyOptions.length > 0) {
      toast({
        title: "Error",
        description: "All options must have text",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would be an API call
    toast({
      title: "Question Added",
      description: "The question has been added successfully.",
    });
    
    setIsAddQuestionDialogOpen(false);
    setNewQuestion({
      text: "",
      options: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]
    });
  };
  
  const handleOptionChange = (index: number, text: string) => {
    setNewQuestion(prev => {
      const updatedOptions = [...prev.options];
      updatedOptions[index] = { ...updatedOptions[index], text };
      return { ...prev, options: updatedOptions };
    });
  };
  
  const handleCorrectOptionChange = (index: number) => {
    setNewQuestion(prev => {
      const updatedOptions = prev.options.map((option, i) => ({
        ...option,
        isCorrect: i === index
      }));
      return { ...prev, options: updatedOptions };
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <p>Loading quiz data...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            className="mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold">Edit Quiz</h1>
        </div>
        
        <Button onClick={() => setIsAddQuestionDialogOpen(true)}>
          Add Question
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateQuiz} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={quiz?.title || ""} 
                    onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={quiz?.description || ""} 
                    onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="courseId">Course</Label>
                  <Select
                    value={quiz.courseId}
                    onValueChange={(value) => setQuiz({ ...quiz, courseId: value })}
                  >
                    <SelectTrigger id="courseId">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="eng">Engineering</SelectItem>
                      <SelectItem value="bus">Business Administration</SelectItem>
                      <SelectItem value="arts">Liberal Arts</SelectItem>
                      <SelectItem value="med">Medical Sciences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input 
                    id="timeLimit" 
                    type="number" 
                    value={quiz?.timeLimit || ""} 
                    onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.value })}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Update Quiz
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Questions ({questions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Question {index + 1}</div>
                          <div className="mt-1">{question.questionText}</div>
                          
                          <div className="mt-4 space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div key={option.id} className="flex items-center">
                                <div className={`w-4 h-4 rounded-full mr-2 ${option.isCorrect ? 'bg-quiz-success' : 'bg-gray-200'}`}></div>
                                <span>{option.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No questions added yet.</p>
                  <p className="mt-2">Click "Add Question" to create your first question.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Question Dialog */}
      <Dialog open={isAddQuestionDialogOpen} onOpenChange={setIsAddQuestionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
            <DialogDescription>
              Enter the question text and options. Mark the correct answer.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddQuestion} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="questionText">Question</Label>
              <Textarea
                id="questionText"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                placeholder="Enter your question here"
                required
              />
            </div>
            
            <div className="space-y-4">
              <Label>Options</Label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={option.isCorrect} 
                      onCheckedChange={() => handleCorrectOptionChange(index)} 
                      id={`option-${index}`}
                    />
                    <label htmlFor={`option-${index}`} className="text-sm">
                      Correct
                    </label>
                  </div>
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddQuestionDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Question</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminQuizEdit;
```

### Step 2: Update src/pages/AdminDashboard.tsx

Add course filtering to the admin dashboard:

```tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuiz } from "@/contexts/QuizContext";
import { useToast } from "@/components/ui/use-toast";
import { Quiz } from "@/types";

const AdminDashboard = () => {
  const { quizzes, loadQuizzes } = useQuiz();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [courseFilter, setCourseFilter] = useState("all");
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    timeLimit: "15",
    courseId: "all"
  });
  
  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);
  
  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    toast({
      title: "Quiz Created",
      description: `"${newQuiz.title}" has been created successfully.`,
    });
    
    setIsCreateDialogOpen(false);
    setNewQuiz({ title: "", description: "", timeLimit: "15", courseId: "all" });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage quizzes and view analytics</p>
        </div>
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create New Quiz
        </Button>
      </div>
      
      <Tabs defaultValue="quizzes">
        <TabsList className="mb-6">
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quizzes">
          <div className="flex mb-4 items-center">
            <span className="mr-2">Filter by course:</span>
            <Select
              value={courseFilter}
              onValueChange={setCourseFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="bus">Business Administration</SelectItem>
                <SelectItem value="arts">Liberal Arts</SelectItem>
                <SelectItem value="med">Medical Sciences</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes
              .filter(quiz => courseFilter === "all" || quiz.courseId === courseFilter)
              .map(quiz => (
                <Card key={quiz.id}>
                  <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{quiz.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div>{quiz.timeLimit} minutes</div>
                      <div>{quiz.questionCount} questions</div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Link to={`/admin/quiz/${quiz.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                User management features will be available in the next version.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Analytics features will be available in the next version.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create Quiz Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
            <DialogDescription>
              Fill in the details for your new quiz. You can add questions after creating the quiz.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateQuiz} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newQuiz.description}
                onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="courseId">Course</Label>
              <Select
                value={newQuiz.courseId}
                onValueChange={(value) => setNewQuiz({ ...newQuiz, courseId: value })}
              >
                <SelectTrigger id="courseId">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="eng">Engineering</SelectItem>
                  <SelectItem value="bus">Business Administration</SelectItem>
                  <SelectItem value="arts">Liberal Arts</SelectItem>
                  <SelectItem value="med">Medical Sciences</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                value={newQuiz.timeLimit}
                onChange={(e) => setNewQuiz({ ...newQuiz, timeLimit: e.target.value })}
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Quiz</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
```

## Adding Result Analysis for Scholarship Decisions

### Step 1: Update src/pages/QuizResult.tsx

Enhance the quiz result page to include scholarship eligibility information:

```tsx
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuiz } from "@/contexts/QuizContext";
import { useAuth } from "@/contexts/AuthContext";

const QuizResult = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { currentQuiz, quizResult } = useQuiz();
  const { authState } = useAuth();
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if no quiz result
    if (!quizResult) {
      navigate(`/quiz/${quizId}`);
      return;
    }
    
    setLoading(false);
  }, [quizResult, quizId, navigate]);
  
  if (loading || !quizResult || !currentQuiz) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <p>Loading results...</p>
      </div>
    );
  }
  
  const { score, totalQuestions, correctAnswers, incorrectAnswers, timeTaken } = quizResult;
  const percentage = (score / totalQuestions) * 100;
  
  // Add scholarship threshold logic
  const scholarshipEligible = percentage >= 75; // 75% threshold
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Quiz Results</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{currentQuiz.title} - Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold mb-2">{score}/{totalQuestions}</div>
              <div className="text-xl text-gray-600">Your Score</div>
            </div>
            
            <Progress value={percentage} className="h-3 mb-2" />
            <div className="flex justify-between text-sm text-gray-600 mb-6">
              <div>0%</div>
              <div>{percentage.toFixed(0)}%</div>
              <div>100%</div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-quiz-blue">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-500">{incorrectAnswers}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{timeTaken}</div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
            </div>
            
            <div className={`mt-6 p-4 rounded-lg border-2 ${
              scholarshipEligible ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
            }`}>
              <h3 className="text-lg font-bold mb-2">
                {scholarshipEligible ? 'Congratulations!' : 'Thank You'}
              </h3>
              <p>
                {scholarshipEligible 
                  ? 'Based on your performance, you are eligible for scholarship consideration. Our admissions team will contact you with next steps.'
                  : 'Thank you for taking our scholarship exam. While you did not meet the scholarship threshold this time, we encourage you to explore other financial aid options.'}
              </p>
              {scholarshipEligible && (
                <Button className="mt-4" variant="outline">
                  <Link to="/scholarship-details">View Scholarship Details</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
          <Button onClick={() => navigate(`/quiz/${quizId}`)}>
            Retake Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
```

## Types and Models Updates

### Step 1: Update src/types/index.ts

Add the necessary types to support course selection:

```typescript
export interface Course {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  courseId: string;
  courseName: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  questionCount: number;
  courseId: string;
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  options: Option[];
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizResult {
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeTaken: string;
  submittedAt: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
}
```

## API and Backend Integration

If you're using a real backend, you'll need to update your API endpoints to support the new course-related functionality.

### Database Schema Updates

Add a courses table and relationships:

```sql
CREATE TABLE courses (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Add course reference to users table
ALTER TABLE users ADD COLUMN course_id VARCHAR(50) REFERENCES courses(id);

-- Add course reference to quizzes table
ALTER TABLE quizzes ADD COLUMN course_id VARCHAR(50) REFERENCES courses(id);
```

## Testing

After making these modifications, make sure to test:

1. The registration flow with course selection
2. The dashboard to ensure it shows course-specific quizzes
3. Admin quiz creation with course association
4. Result page with scholarship eligibility information

## Deployment Considerations

When deploying the application:

1. Set up proper database indices for course-related queries
2. Configure proper access controls to ensure students can only access quizzes for their selected courses
3. Add monitoring for scholarship thresholds and result distribution
