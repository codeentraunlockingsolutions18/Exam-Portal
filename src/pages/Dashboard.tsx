
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/contexts/QuizContext";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { quizzes, loadQuizzes } = useQuiz();
  const { authState } = useAuth();
  
  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {authState.user?.name}</h1>
          <p className="text-gray-600 mt-1">Browse available quizzes and test your knowledge</p>
        </div>
        
        {authState.user?.role === "admin" && (
          <Link to="/admin">
            <Button variant="outline">Admin Dashboard</Button>
          </Link>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map(quiz => (
          <Card key={quiz.id} className="quiz-card">
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {quiz.timeLimit} mins
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {quiz.questionCount} questions
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link to={`/quiz/${quiz.id}`} className="w-full">
                <Button className="w-full quiz-button-primary">
                  Start Quiz
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        
        {quizzes.length === 0 && (
          <div className="col-span-3 text-center py-20">
            <p className="text-gray-500">Loading quizzes...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
