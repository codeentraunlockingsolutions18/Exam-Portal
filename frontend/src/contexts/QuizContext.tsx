import { createContext, useContext, useState, ReactNode } from "react";
import { Quiz, Question, Option, Answer, QuizResult } from "@/types";

// Mock data
const mockQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Computer Science Fundamentals",
    description: "Test your knowledge of basic computer science concepts",
    timeLimit: 15, // minutes
    questionCount: 10,
    courseId: "cs"
  },
  {
    id: "2",
    title: "Engineering Principles",
    description: "Challenge yourself with key engineering concepts",
    timeLimit: 20,
    questionCount: 15,
    courseId: "eng"
  },
  {
    id: "3",
    title: "Business Administration Basics",
    description: "Test your understanding of business principles",
    timeLimit: 25,
    questionCount: 12,
    courseId: "bus"
  },
  {
    id: "4",
    title: "General Knowledge",
    description: "Test your general knowledge across multiple subjects",
    timeLimit: 15,
    questionCount: 20,
    courseId: "all"
  },
];

const mockQuestions: Record<string, Question[]> = {
  "1": [
    {
      id: "q1-1",
      quizId: "1",
      questionText: "What does HTML stand for?",
      options: [
        { id: "q1-1-a", questionId: "q1-1", text: "Hyper Text Markup Language", isCorrect: true },
        { id: "q1-1-b", questionId: "q1-1", text: "Hyper Transfer Markup Language", isCorrect: false },
        { id: "q1-1-c", questionId: "q1-1", text: "High Tech Modern Language", isCorrect: false },
        { id: "q1-1-d", questionId: "q1-1", text: "Hyperlink and Text Markup Language", isCorrect: false },
      ]
    },
    {
      id: "q1-2",
      quizId: "1",
      questionText: "Which CSS property is used to change the text color?",
      options: [
        { id: "q1-2-a", questionId: "q1-2", text: "text-color", isCorrect: false },
        { id: "q1-2-b", questionId: "q1-2", text: "font-color", isCorrect: false },
        { id: "q1-2-c", questionId: "q1-2", text: "color", isCorrect: true },
        { id: "q1-2-d", questionId: "q1-2", text: "text-style", isCorrect: false },
      ]
    },
    {
      id: "q1-3",
      quizId: "1",
      questionText: "What is the correct JavaScript syntax to change the content of the HTML element with id 'demo'?",
      options: [
        { id: "q1-3-a", questionId: "q1-3", text: "#demo.innerHTML = 'Hello World!';", isCorrect: false },
        { id: "q1-3-b", questionId: "q1-3", text: "document.getElement('demo').innerHTML = 'Hello World!';", isCorrect: false },
        { id: "q1-3-c", questionId: "q1-3", text: "document.getElementById('demo').innerHTML = 'Hello World!';", isCorrect: true },
        { id: "q1-3-d", questionId: "q1-3", text: "document.getElementByName('demo').innerHTML = 'Hello World!';", isCorrect: false },
      ]
    },
  ],
  "2": [
    {
      id: "q2-1",
      quizId: "2",
      questionText: "What is JSX in React?",
      options: [
        { id: "q2-1-a", questionId: "q2-1", text: "A JavaScript library", isCorrect: false },
        { id: "q2-1-b", questionId: "q2-1", text: "A syntax extension for JavaScript that allows writing HTML-like code in JavaScript", isCorrect: true },
        { id: "q2-1-c", questionId: "q2-1", text: "A database query language", isCorrect: false },
        { id: "q2-1-d", questionId: "q2-1", text: "JavaScript XML", isCorrect: false },
      ]
    },
    {
      id: "q2-2",
      quizId: "2",
      questionText: "What is a React Hook?",
      options: [
        { id: "q2-2-a", questionId: "q2-2", text: "A way to use state and other React features in functional components", isCorrect: true },
        { id: "q2-2-b", questionId: "q2-2", text: "A method to connect React with backend APIs", isCorrect: false },
        { id: "q2-2-c", questionId: "q2-2", text: "A tool for debugging React applications", isCorrect: false },
        { id: "q2-2-d", questionId: "q2-2", text: "A component lifecycle method", isCorrect: false },
      ]
    },
  ],
};

interface QuizContextType {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  currentQuestions: Question[];
  userAnswers: Answer[];
  quizResult: QuizResult | null;
  loadQuizzes: () => Promise<Quiz[]>;
  getQuiz: (id: string) => Promise<Quiz | null>;
  getQuizQuestions: (quizId: string) => Promise<Question[]>;
  startQuiz: (quizId: string) => Promise<void>;
  submitAnswer: (questionId: string, optionId: string) => void;
  submitQuiz: () => Promise<QuizResult>;
  clearQuizState: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const loadQuizzes = async (): Promise<Quiz[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setQuizzes(mockQuizzes);
    return mockQuizzes;
  };

  const getQuiz = async (id: string): Promise<Quiz | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockQuizzes.find(quiz => quiz.id === id) || null;
  };

  const getQuizQuestions = async (quizId: string): Promise<Question[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockQuestions[quizId] || [];
  };

  const startQuiz = async (quizId: string) => {
    const quiz = await getQuiz(quizId);
    if (!quiz) throw new Error("Quiz not found");
    
    const questions = await getQuizQuestions(quizId);
    
    setCurrentQuiz(quiz);
    setCurrentQuestions(questions);
    setUserAnswers([]);
    setQuizResult(null);
  };

  const submitAnswer = (questionId: string, optionId: string) => {
    setUserAnswers(prev => {
      // Check if already answered, if so update
      const existingAnswerIndex = prev.findIndex(answer => answer.questionId === questionId);
      
      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...prev];
        updatedAnswers[existingAnswerIndex] = { questionId, selectedOptionId: optionId };
        return updatedAnswers;
      }
      
      // Otherwise add new answer
      return [...prev, { questionId, selectedOptionId: optionId }];
    });
  };

  const submitQuiz = async (): Promise<QuizResult> => {
    if (!currentQuiz || currentQuestions.length === 0) {
      throw new Error("No active quiz");
    }

    // Calculate score
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    
    const detailedAnswers = currentQuestions.map(question => {
      const userAnswer = userAnswers.find(a => a.questionId === question.id);
      const selectedOption = question.options.find(o => userAnswer && o.id === userAnswer.selectedOptionId);
      const isCorrect = selectedOption?.isCorrect || false;
      
      if (isCorrect) correctAnswers++;
      else incorrectAnswers++;
      
      return {
        question,
        selectedOption: selectedOption || { id: "", questionId: question.id, text: "Not answered" },
        isCorrect,
      };
    });

    const score = Math.round((correctAnswers / currentQuestions.length) * 100);
    
    // Calculate time taken (in a real app, we'd track start time)
    const timeTaken = "10:45"; // Mock time taken
    
    const result: QuizResult = {
      quiz: currentQuiz,
      score,
      totalQuestions: currentQuestions.length,
      answers: detailedAnswers,
      correctAnswers,
      incorrectAnswers,
      timeTaken,
      submittedAt: new Date().toISOString(),
    };
    
    setQuizResult(result);
    return result;
  };

  const clearQuizState = () => {
    setCurrentQuiz(null);
    setCurrentQuestions([]);
    setUserAnswers([]);
    setQuizResult(null);
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        currentQuiz,
        currentQuestions,
        userAnswers,
        quizResult,
        loadQuizzes,
        getQuiz,
        getQuizQuestions,
        startQuiz,
        submitAnswer,
        submitQuiz,
        clearQuizState,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  
  return context;
};
