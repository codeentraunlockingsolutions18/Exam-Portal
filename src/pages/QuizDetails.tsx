
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuiz } from "@/contexts/QuizContext";
import { useToast } from "@/components/ui/use-toast";

const QuizDetails = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuiz, startQuiz } = useQuiz();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!quizId) return;
        const quizData = await getQuiz(quizId);
        setQuiz(quizData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load quiz details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [quizId, getQuiz, toast]);
  
  const handleStartQuiz = async () => {
    try {
      if (!quizId) return;
      await startQuiz(quizId);
      navigate(`/quiz/${quizId}/take`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not start quiz",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <p>Loading quiz details...</p>
      </div>
    );
  }
  
  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
          <Button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        onClick={() => navigate("/dashboard")}
        className="mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </Button>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">{quiz.description}</p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Quiz Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Time Limit</p>
                <p className="font-medium">{quiz.timeLimit} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Questions</p>
                <p className="font-medium">{quiz.questionCount}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Instructions</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Read each question carefully before answering.</li>
              <li>You can navigate between questions using the next/previous buttons.</li>
              <li>The quiz will be automatically submitted when the time expires.</li>
              <li>Your score will be shown immediately after submission.</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartQuiz} className="w-full quiz-button-primary">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizDetails;
