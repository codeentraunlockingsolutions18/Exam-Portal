
import React, { createContext, useState, useContext, useCallback } from "react";
import { Quiz, Question, Option, Answer, QuizResult } from "@/types";
import { useAuth } from "./AuthContext";
import { submitQuiz } from "@/services/supabaseService";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuizContextProps {
  currentQuiz: Quiz | null;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  userAnswers: Answer[];
  setUserAnswers: (answers: Answer[]) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  timerMinutes: number;
  timerSeconds: number;
  setTimer: (minutes: number, seconds: number) => void;
  quizStartTime: Date | null;
  setQuizStartTime: (date: Date | null) => void;
  quizResult: QuizResult | null;
  setQuizResult: (result: QuizResult | null) => void;
  submitQuizAnswers: () => Promise<void>;
  answerQuestion: (questionId: string, optionId: string) => void;
  calculateScore: () => { score: number; correctAnswers: number; incorrectAnswers: number };
  
  // Add missing properties here
  quizzes: Quiz[];
  loadQuizzes: () => Promise<void>;
  getQuiz: (quizId: string) => Promise<Quiz | null>;
  getQuizQuestions: (quizId: string) => Promise<Question[]>;
  startQuiz: (quizId: string) => Promise<void>;
  currentQuestions: Question[];
  submitAnswer: (questionId: string, optionId: string) => void;
  submitQuiz: () => Promise<QuizResult | null>;
}

const QuizContext = createContext<QuizContextProps>({
  currentQuiz: null,
  setCurrentQuiz: () => {},
  questions: [],
  setQuestions: () => {},
  userAnswers: [],
  setUserAnswers: () => {},
  currentQuestionIndex: 0,
  setCurrentQuestionIndex: () => {},
  timerMinutes: 0,
  timerSeconds: 0,
  setTimer: () => {},
  quizStartTime: null,
  setQuizStartTime: () => {},
  quizResult: null,
  setQuizResult: () => {},
  submitQuizAnswers: async () => {},
  answerQuestion: () => {},
  calculateScore: () => ({ score: 0, correctAnswers: 0, incorrectAnswers: 0 }),
  
  // Add missing properties to the default context
  quizzes: [],
  loadQuizzes: async () => {},
  getQuiz: async () => null,
  getQuizQuestions: async () => [],
  startQuiz: async () => {},
  currentQuestions: [],
  submitAnswer: () => {},
  submitQuiz: async () => null,
});

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  
  const { authState } = useAuth();
  
  const setTimer = (minutes: number, seconds: number) => {
    setTimerMinutes(minutes);
    setTimerSeconds(seconds);
  };
  
  const answerQuestion = (questionId: string, optionId: string) => {
    const existingAnswerIndex = userAnswers.findIndex(
      (a) => a.questionId === questionId
    );
  
    if (existingAnswerIndex !== -1) {
      const newAnswers = [...userAnswers];
      newAnswers[existingAnswerIndex].selectedOptionId = optionId;
      setUserAnswers(newAnswers);
    } else {
      setUserAnswers([...userAnswers, { questionId, selectedOptionId: optionId }]);
    }
  };
  
  const calculateScore = () => {
    let correctCount = 0;
    
    // Check each user answer against the correct answer
    userAnswers.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) return;
      
      const selectedOption = question.options.find(
        (o) => o.id === answer.selectedOptionId
      );
      
      if (selectedOption?.isCorrect) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / questions.length) * 100);
    const incorrectAnswers = questions.length - correctCount;
    
    return {
      score,
      correctAnswers: correctCount,
      incorrectAnswers,
    };
  };
  
  const submitQuizAnswers = async () => {
    if (!currentQuiz || !authState.user) {
      toast({
        title: "Error",
        description: "Quiz or user information is missing",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { score, correctAnswers, incorrectAnswers } = calculateScore();
      
      // Format answers for submission
      const formattedAnswers = userAnswers.map(answer => ({
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId
      }));
      
      // Save submission to Supabase
      await submitQuiz(
        currentQuiz.id,
        authState.user.id,
        score,
        formattedAnswers
      );
      
      // Calculate time taken
      let timeTaken = "Not recorded";
      if (quizStartTime) {
        const endTime = new Date();
        const diff = Math.abs(endTime.getTime() - quizStartTime.getTime());
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        timeTaken = `${minutes}m ${seconds}s`;
      }
      
      // Build result object
      const result: QuizResult = {
        quiz: currentQuiz,
        score,
        totalQuestions: questions.length,
        correctAnswers,
        incorrectAnswers,
        timeTaken,
        submittedAt: new Date().toISOString(),
        answers: userAnswers.map((answer) => {
          const question = questions.find((q) => q.id === answer.questionId)!;
          const selectedOption = question.options.find(
            (o) => o.id === answer.selectedOptionId
          )!;
          const isCorrect = selectedOption.isCorrect || false;
          
          return {
            question,
            selectedOption,
            isCorrect,
          };
        }),
      };
      
      setQuizResult(result);
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit your quiz answers. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add implementation for missing functions
  const loadQuizzes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*, questions(count)')
        .order('title');
        
      if (error) throw error;
      
      // Transform the data to match our Quiz type
      const formattedQuizzes: Quiz[] = data.map((quiz: any) => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description || '',
        timeLimit: quiz.time_limit,
        questionCount: quiz.questions?.[0]?.count || 0,
        courseId: quiz.course_id
      }));
      
      setQuizzes(formattedQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      toast({
        title: "Failed to load quizzes",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }, []);

  const getQuiz = useCallback(async (quizId: string): Promise<Quiz | null> => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*, questions(count)')
        .eq('id', quizId)
        .single();
        
      if (error) throw error;
      
      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        timeLimit: data.time_limit,
        questionCount: data.questions?.[0]?.count || 0,
        courseId: data.course_id
      };
    } catch (error) {
      console.error('Error fetching quiz:', error);
      return null;
    }
  }, []);

  const getQuizQuestions = useCallback(async (quizId: string): Promise<Question[]> => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*, options(*)')
        .eq('quiz_id', quizId);
        
      if (error) throw error;
      
      return data.map((q: any) => ({
        id: q.id,
        quizId: q.quiz_id,
        questionText: q.question_text,
        options: q.options.map((o: any) => ({
          id: o.id,
          questionId: o.question_id,
          text: o.option_text,
          isCorrect: o.is_correct
        }))
      }));
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      return [];
    }
  }, []);

  const startQuiz = useCallback(async (quizId: string) => {
    try {
      // Get quiz details
      const quiz = await getQuiz(quizId);
      if (!quiz) throw new Error("Quiz not found");
      
      // Get questions
      const quizQuestions = await getQuizQuestions(quizId);
      if (quizQuestions.length === 0) throw new Error("No questions found for this quiz");
      
      // Set up quiz state
      setCurrentQuiz(quiz);
      setQuestions(quizQuestions);
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
      setTimer(quiz.timeLimit, 0);
      setQuizStartTime(new Date());
      setQuizResult(null);
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast({
        title: "Failed to start quiz",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }, [getQuiz, getQuizQuestions]);

  // Alias for answerQuestion for compatibility
  const submitAnswer = (questionId: string, optionId: string) => {
    answerQuestion(questionId, optionId);
  };

  // Alias for submitQuizAnswers for compatibility
  const submitQuiz = async (): Promise<QuizResult | null> => {
    await submitQuizAnswers();
    return quizResult;
  };

  // Current questions property for compatibility
  const currentQuestions = questions;

  return (
    <QuizContext.Provider
      value={{
        currentQuiz,
        setCurrentQuiz,
        questions,
        setQuestions,
        userAnswers,
        setUserAnswers,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        timerMinutes,
        timerSeconds,
        setTimer,
        quizStartTime,
        setQuizStartTime,
        quizResult,
        setQuizResult,
        submitQuizAnswers,
        answerQuestion,
        calculateScore,
        // Add new properties to the context value
        quizzes,
        loadQuizzes,
        getQuiz,
        getQuizQuestions,
        startQuiz,
        currentQuestions,
        submitAnswer,
        submitQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
