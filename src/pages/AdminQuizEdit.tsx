
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useQuiz } from "@/contexts/QuizContext";
import { Question, Option } from "@/types";

const AdminQuizEdit = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuiz, getQuizQuestions } = useQuiz();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]
  });
  
  // Load quiz and questions data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        if (!quizId) return;
        
        const quizData = await getQuiz(quizId);
        if (!quizData) {
          toast({ title: "Error", description: "Quiz not found", variant: "destructive" });
          navigate("/admin");
          return;
        }
        
        setQuiz(quizData);
        
        const questionsData = await getQuizQuestions(quizId);
        setQuestions(questionsData);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load quiz data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizData();
  }, [quizId, getQuiz, getQuizQuestions, navigate, toast]);
  
  const handleUpdateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    toast({
      title: "Quiz Updated",
      description: "Quiz details have been updated successfully.",
    });
  };
  
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate question
    if (!newQuestion.text.trim()) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive",
      });
      return;
    }
    
    // Validate options
    const emptyOptions = newQuestion.options.filter(o => !o.text.trim());
    if (emptyOptions.length > 0) {
      toast({
        title: "Error",
        description: "All options must have text",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would be an API call
    toast({
      title: "Question Added",
      description: "The question has been added successfully.",
    });
    
    setIsAddQuestionDialogOpen(false);
    setNewQuestion({
      text: "",
      options: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]
    });
  };
  
  const handleOptionChange = (index: number, text: string) => {
    setNewQuestion(prev => {
      const updatedOptions = [...prev.options];
      updatedOptions[index] = { ...updatedOptions[index], text };
      return { ...prev, options: updatedOptions };
    });
  };
  
  const handleCorrectOptionChange = (index: number) => {
    setNewQuestion(prev => {
      const updatedOptions = prev.options.map((option, i) => ({
        ...option,
        isCorrect: i === index
      }));
      return { ...prev, options: updatedOptions };
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <p>Loading quiz data...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            className="mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold">Edit Quiz</h1>
        </div>
        
        <Button onClick={() => setIsAddQuestionDialogOpen(true)}>
          Add Question
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateQuiz} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={quiz?.title || ""} 
                    onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={quiz?.description || ""} 
                    onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input 
                    id="timeLimit" 
                    type="number" 
                    value={quiz?.timeLimit || ""} 
                    onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.value })}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Update Quiz
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Questions ({questions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Question {index + 1}</div>
                          <div className="mt-1">{question.questionText}</div>
                          
                          <div className="mt-4 space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div key={option.id} className="flex items-center">
                                <div className={`w-4 h-4 rounded-full mr-2 ${option.isCorrect ? 'bg-quiz-success' : 'bg-gray-200'}`}></div>
                                <span>{option.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No questions added yet.</p>
                  <p className="mt-2">Click "Add Question" to create your first question.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Question Dialog */}
      <Dialog open={isAddQuestionDialogOpen} onOpenChange={setIsAddQuestionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
            <DialogDescription>
              Enter the question text and options. Mark the correct answer.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddQuestion} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="questionText">Question</Label>
              <Textarea
                id="questionText"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                placeholder="Enter your question here"
                required
              />
            </div>
            
            <div className="space-y-4">
              <Label>Options</Label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={option.isCorrect} 
                      onCheckedChange={() => handleCorrectOptionChange(index)} 
                      id={`option-${index}`}
                    />
                    <label htmlFor={`option-${index}`} className="text-sm">
                      Correct
                    </label>
                  </div>
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddQuestionDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Question</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminQuizEdit;
