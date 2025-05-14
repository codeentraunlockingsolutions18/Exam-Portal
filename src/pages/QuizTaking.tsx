import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuiz } from "@/contexts/QuizContext";
import { Question } from "@/types";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const QuizTaking = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuiz, getQuizQuestions, startQuiz, submitAnswer, submitQuiz, currentQuiz, currentQuestions, userAnswers } = useQuiz();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizId) return;
      
      try {
        setIsLoading(true);
        const quiz = await getQuiz(quizId);
        
        if (!quiz) {
          toast({
            title: "Error",
            description: "Quiz not found",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        startQuiz(quiz);
        setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
      } catch (error) {
        console.error("Error loading quiz:", error);
        toast({
          title: "Error",
          description: "Failed to load quiz",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuiz();
  }, [quizId, getQuiz, startQuiz, navigate]);
  
  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isLoading) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, isLoading]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleOptionSelect = (questionId: string, optionId: string) => {
    submitAnswer(questionId, optionId);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleSubmitQuiz = async () => {
    try {
      setIsSubmitting(true);
      const submissionId = await submitQuiz();
      
      if (submissionId) {
        navigate(`/quiz-result/${submissionId}`);
      } else {
        toast({
          title: "Error",
          description: "Failed to submit quiz",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-lg">Loading quiz...</p>
      </div>
    );
  }
  
  if (!currentQuiz || currentQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <p className="text-lg text-red-500">Quiz not found or no questions available</p>
        <Button onClick={() => navigate("/dashboard")} className="mt-4">
          Return to Dashboard
        </Button>
      </div>
    );
  }
  
  const currentQuestion: Question = currentQuestions[currentQuestionIndex];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{currentQuiz.title}</CardTitle>
              <CardDescription>
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </CardDescription>
            </div>
            {timeLeft !== null && (
              <div className="text-lg font-semibold">
                Time Left: {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-lg font-medium">{currentQuestion.questionText}</div>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    userAnswers[currentQuestion.id] === option.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                >
                  {option.text}
                </div>
              ))}
            </div>
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
            {currentQuestionIndex < currentQuestions.length - 1 ? (
              <Button onClick={handleNextQuestion}>Next</Button>
            ) : (
              <Button 
                onClick={handleSubmitQuiz} 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Quiz"
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-8 w-full max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-2 justify-center">
          {currentQuestions.map((q, index) => (
            <Button
              key={q.id}
              variant={userAnswers[q.id] ? "default" : "outline"}
              className={`w-10 h-10 p-0 ${currentQuestionIndex === index ? "ring-2 ring-offset-2" : ""}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;
