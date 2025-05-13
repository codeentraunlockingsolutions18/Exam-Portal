
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuiz } from "@/contexts/QuizContext";
import { Question, Option } from "@/types";
import QuestionForm from "@/components/forms/QuestionForm";
import { supabase } from "@/integrations/supabase/client";

const AdminQuizEdit = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuiz, getQuizQuestions } = useQuiz();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);
  
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
  
  const handleAddQuestion = async (questionData: any) => {
    if (!quizId) return;
    
    try {
      let questionId;
      let imageUrl = null;
      
      // If it's an image question, upload the image first
      if (questionData.type === "image" && questionData.image) {
        const file = questionData.image;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `questions/${fileName}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('questions')
          .upload(filePath, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('questions')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }
      
      // Create question in database
      const questionText = questionData.type === "text" 
        ? questionData.text 
        : `[IMAGE]: ${imageUrl}`;
        
      const options = questionData.type === "text" 
        ? questionData.options 
        : questionData.imageOptions;
      
      // In a real app, this would insert into the database
      // For now, just simulate adding to the list
      const newQuestion: Question = {
        id: Math.random().toString(),
        quizId: quizId,
        questionText: questionText,
        options: options.map((opt: any, index: number) => ({
          id: Math.random().toString(),
          questionId: "",
          text: opt.text,
          isCorrect: opt.isCorrect
        }))
      };
      
      setQuestions(prev => [...prev, newQuestion]);
      setIsAddQuestionDialogOpen(false);
      
      toast({
        title: "Question Added",
        description: "The question has been added successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add question",
        variant: "destructive",
      });
    }
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
                        <div className="w-full">
                          <div className="font-medium">Question {index + 1}</div>
                          
                          {/* Display question based on type */}
                          {question.questionText.startsWith("[IMAGE]:") ? (
                            <div className="mt-2">
                              <img 
                                src={question.questionText.replace("[IMAGE]:", "").trim()} 
                                alt="Question" 
                                className="max-h-32 object-contain mb-2"
                              />
                            </div>
                          ) : (
                            <div className="mt-1">{question.questionText}</div>
                          )}
                          
                          <div className="mt-4 space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div key={option.id} className="flex items-center">
                                <div className={`w-4 h-4 rounded-full mr-2 ${option.isCorrect ? 'bg-green-500' : 'bg-gray-200'}`}></div>
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
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
            <DialogDescription>
              Create a text-based question or upload an image as a question.
            </DialogDescription>
          </DialogHeader>
          
          <QuestionForm 
            onSave={handleAddQuestion}
            onCancel={() => setIsAddQuestionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminQuizEdit;
