
import React, { createContext, useState, useContext } from "react";
import { Quiz, Question, Option, Answer, QuizResult } from "@/types";
import { useAuth } from "./AuthContext";
import { submitQuiz } from "@/services/supabaseService";
import { toast } from "@/components/ui/use-toast";

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
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
