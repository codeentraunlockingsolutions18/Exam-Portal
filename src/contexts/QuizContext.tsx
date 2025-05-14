
import React, { createContext, useContext, useState } from "react";
import { Question, Quiz, Option } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getQuizzesByCourse, getQuizById, getQuestionsByQuizId, submitQuiz as submitQuizToDb } from "@/services/supabaseService";

interface QuizContextProps {
  currentQuiz: Quiz | null;
  currentQuestions: Question[];
  userAnswers: Record<string, string>;
  quizzes: Quiz[];
  loadQuizzes: (courseId?: string) => Promise<void>;
  getQuiz: (quizId: string) => Promise<Quiz | null>;
  getQuizQuestions: (quizId: string) => Promise<Question[]>;
  startQuiz: (quiz: Quiz) => void;
  submitAnswer: (questionId: string, optionId: string) => void;
  submitQuiz: () => Promise<string | null>;
}

const QuizContext = createContext<QuizContextProps>({
  currentQuiz: null,
  currentQuestions: [],
  userAnswers: {},
  quizzes: [],
  loadQuizzes: async () => {},
  getQuiz: async () => null,
  getQuizQuestions: async () => [],
  startQuiz: () => {},
  submitAnswer: () => {},
  submitQuiz: async () => null,
});

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const loadQuizzes = async (courseId?: string) => {
    try {
      if (courseId) {
        const fetchedQuizzes = await getQuizzesByCourse(courseId);
        setQuizzes(fetchedQuizzes);
      } else {
        // If no course ID provided, fetch all quizzes
        const { data, error } = await supabase
          .from('quizzes')
          .select('*');
        
        if (error) throw error;
        
        setQuizzes(data.map(quiz => ({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description || '',
          timeLimit: quiz.time_limit,
          questionCount: 0, // We'll need to fetch this separately
          courseId: quiz.course_id
        })));
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  };

  const getQuiz = async (quizId: string): Promise<Quiz | null> => {
    try {
      const quiz = await getQuizById(quizId);
      return quiz;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      return null;
    }
  };

  const getQuizQuestions = async (quizId: string): Promise<Question[]> => {
    try {
      const questions = await getQuestionsByQuizId(quizId);
      return questions;
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      return [];
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    getQuizQuestions(quiz.id).then(questions => {
      setCurrentQuestions(questions);
      // Reset user answers when starting a new quiz
      setUserAnswers({});
    });
  };

  const submitAnswer = (questionId: string, optionId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const calculateScore = () => {
    let score = 0;
    
    for (const question of currentQuestions) {
      const selectedOptionId = userAnswers[question.id];
      if (selectedOptionId) {
        const correctOption = question.options.find(opt => opt.isCorrect);
        if (correctOption && correctOption.id === selectedOptionId) {
          score++;
        }
      }
    }
    
    return score;
  };

  const submitQuiz = async (): Promise<string | null> => {
    try {
      if (!currentQuiz) return null;
      
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error('User not authenticated');
      
      const score = calculateScore();
      const totalQuestions = currentQuestions.length;
      const scorePercentage = Math.round((score / totalQuestions) * 100);
      
      // Format answers for submission
      const formattedAnswers = Object.entries(userAnswers).map(([questionId, optionId]) => ({
        questionId,
        selectedOptionId: optionId
      }));
      
      // Submit quiz to database
      const submissionId = await submitQuizToDb(
        currentQuiz.id,
        authData.user.id,
        scorePercentage,
        formattedAnswers
      );
      
      return submissionId;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      return null;
    }
  };

  const value = {
    currentQuiz,
    currentQuestions,
    userAnswers,
    quizzes,
    loadQuizzes,
    getQuiz,
    getQuizQuestions,
    startQuiz,
    submitAnswer,
    submitQuiz
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => useContext(QuizContext);
