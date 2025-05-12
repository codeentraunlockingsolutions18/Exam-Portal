
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
  const percentage = score;
  
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
              <div className="text-5xl font-bold mb-2">{score}%</div>
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
                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
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
