
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuiz } from "@/contexts/QuizContext";
import { useToast } from "@/components/ui/use-toast";

const QuizTaking = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { 
    currentQuiz, 
    currentQuestions, 
    userAnswers, 
    submitAnswer, 
    submitQuiz 
  } = useQuiz();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set up timer when quiz starts
  useEffect(() => {
    if (!currentQuiz) {
      navigate(`/quiz/${quizId}`);
      return;
    }
    
    // Convert minutes to seconds
    const totalSeconds = currentQuiz.timeLimit * 60;
    setTimeLeft(totalSeconds);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuizSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuiz, quizId, navigate]);
  
  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;
  
  // Find current answer if it exists
  const currentAnswer = userAnswers.find(
    answer => currentQuestion && answer.questionId === currentQuestion.id
  );
  
  const handleOptionSelect = (questionId: string, optionId: string) => {
    submitAnswer(questionId, optionId);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleQuizSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const result = await submitQuiz();
      navigate(`/quiz/${quizId}/result`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  // Redirect if no current quiz or questions
  if (!currentQuiz || !currentQuestions.length) {
    return null; // Redirect handled in useEffect
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{currentQuiz.title}</h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div className="quiz-timer">
            <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-500' : ''}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-gray-500">Time Remaining</div>
          </div>
        </div>
        
        <Progress 
          value={(currentQuestionIndex + 1) / totalQuestions * 100} 
          className="mb-6"
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestion?.questionText}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion?.options.map(option => (
                <div 
                  key={option.id} 
                  className={`quiz-option ${currentAnswer?.selectedOptionId === option.id ? 'quiz-option-selected' : ''}`}
                  onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                      currentAnswer?.selectedOptionId === option.id ? 'bg-quiz-blue border-quiz-blue' : 'border-gray-300'
                    }`}>
                      {currentAnswer?.selectedOptionId === option.id && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>{option.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentQuestionIndex === totalQuestions - 1 ? (
                <Button 
                  onClick={handleQuizSubmit}
                  disabled={isSubmitting}
                  className="quiz-button-primary"
                >
                  {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </Button>
              ) : (
                <Button 
                  onClick={handleNextQuestion} 
                  className="quiz-button-primary"
                >
                  Next
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {userAnswers.length} of {totalQuestions} questions answered
          </div>
          
          <Button 
            variant="outline" 
            className="text-quiz-purple border-quiz-purple hover:bg-purple-50"
            onClick={handleQuizSubmit}
          >
            Submit Quiz Early
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;
