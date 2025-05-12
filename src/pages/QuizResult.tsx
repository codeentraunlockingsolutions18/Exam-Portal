
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuiz } from "@/contexts/QuizContext";

const QuizResult = () => {
  const navigate = useNavigate();
  const { quizResult, clearQuizState } = useQuiz();
  
  // Redirect to dashboard if no quiz result
  useEffect(() => {
    if (!quizResult) {
      navigate("/dashboard");
    }
  }, [quizResult, navigate]);
  
  const handleBackToDashboard = () => {
    clearQuizState();
    navigate("/dashboard");
  };
  
  if (!quizResult) {
    return null;
  }
  
  const { quiz, score, totalQuestions, answers } = quizResult;
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  
  // Determine performance level
  let performanceText = '';
  let performanceColor = '';
  
  if (score >= 90) {
    performanceText = 'Excellent!';
    performanceColor = 'text-quiz-success';
  } else if (score >= 70) {
    performanceText = 'Good Job!';
    performanceColor = 'text-quiz-info';
  } else if (score >= 50) {
    performanceText = 'Not Bad';
    performanceColor = 'text-quiz-warning';
  } else {
    performanceText = 'Needs Improvement';
    performanceColor = 'text-quiz-error';
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Quiz Results</h1>
          <p className="text-gray-600">{quiz.title}</p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{score}%</div>
              <div className={`text-xl ${performanceColor} font-medium`}>{performanceText}</div>
              <div className="mt-4 text-gray-600">
                You got {correctAnswers} out of {totalQuestions} questions correct
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-center mb-4">
                <div className="w-full max-w-md h-8 bg-gray-200 rounded-full">
                  <div 
                    className="h-full rounded-full bg-quiz-blue"
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-500">
                <div>0%</div>
                <div>50%</div>
                <div>100%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Question Review</h2>
          
          {answers.map((answer, index) => (
            <Card 
              key={index} 
              className={`border-l-4 ${answer.isCorrect ? 'border-l-quiz-success' : 'border-l-quiz-error'}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium mb-2">Question {index + 1}</div>
                    <div className="text-lg mb-4">{answer.question.questionText}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-sm ${answer.isCorrect ? 'bg-green-100 text-quiz-success' : 'bg-red-100 text-quiz-error'}`}>
                    {answer.isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  {answer.question.options.map(option => (
                    <div 
                      key={option.id}
                      className={`p-3 rounded-md ${
                        option.isCorrect ? 'bg-green-50 border border-green-200' : 
                        answer.selectedOption.id === option.id && !option.isCorrect ? 'bg-red-50 border border-red-200' :
                        'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        {option.isCorrect ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-quiz-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : answer.selectedOption.id === option.id ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-quiz-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          <div className="w-5 h-5 mr-2"></div>
                        )}
                        <span>{option.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button onClick={handleBackToDashboard} className="quiz-button-primary">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
