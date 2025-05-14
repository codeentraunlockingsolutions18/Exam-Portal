import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuiz } from "@/contexts/QuizContext";
import { Quiz } from "@/types";
import { Loader2 } from "lucide-react";

const QuizDetails = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuiz, startQuiz } = useQuiz();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      if (!quizId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const quizData = await getQuiz(quizId);
        
        if (!quizData) {
          setError("Quiz not found");
          return;
        }
        
        setQuiz(quizData);
      } catch (err) {
        console.error("Error fetching quiz details:", err);
        setError("Failed to load quiz details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizDetails();
  }, [quizId, getQuiz]);

  const handleStartQuiz = () => {
    if (quiz) {
      startQuiz(quiz);
      navigate(`/quiz/${quizId}/take`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading quiz details...</span>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <h2 className="text-xl font-bold text-red-500">Error</h2>
        <p className="text-gray-600">{error || "Quiz not found"}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          <CardDescription>
            {quiz.description || "No description available"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-medium">Time Limit</p>
              <p className="text-2xl font-bold">{quiz.timeLimit} minutes</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-medium">Questions</p>
              <p className="text-2xl font-bold">{quiz.questionCount}</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Once you start the quiz, the timer will begin. You must complete all questions within the time limit.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back
          </Button>
          <Button onClick={handleStartQuiz}>
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizDetails;
