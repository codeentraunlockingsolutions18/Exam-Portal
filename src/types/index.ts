
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  questionCount: number;
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  options: Option[];
}

export interface Option {
  id: string;
  questionId: string;
  text: string;
  isCorrect?: boolean; // Only visible in admin mode or after quiz completion
}

export interface Submission {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  submittedAt: string;
}

export interface Answer {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizResult {
  quiz: Quiz;
  score: number;
  totalQuestions: number;
  answers: {
    question: Question;
    selectedOption: Option;
    isCorrect: boolean;
  }[];
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
