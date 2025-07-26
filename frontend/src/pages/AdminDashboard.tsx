
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuiz } from "@/contexts/QuizContext";
import { useToast } from "@/components/ui/use-toast";
import { Quiz } from "@/types";

const AdminDashboard = () => {
  const { quizzes, loadQuizzes } = useQuiz();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    timeLimit: "15",
  });
  
  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);
  
  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    toast({
      title: "Quiz Created",
      description: `"${newQuiz.title}" has been created successfully.`,
    });
    
    setIsCreateDialogOpen(false);
    setNewQuiz({ title: "", description: "", timeLimit: "15" });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        {/* <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage quizzes and view analytics</p>
        </div> */}
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create New Quiz
        </Button>
      </div>
      
      <Tabs defaultValue="quizzes">
        <TabsList className="mb-6">
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quizzes">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(quiz => (
              <Card key={quiz.id}>
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div>{quiz.timeLimit} minutes</div>
                    <div>{quiz.questionCount} questions</div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Link to={`/admin/quiz/${quiz.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                User management features will be available in the next version.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Analytics features will be available in the next version.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create Quiz Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
            <DialogDescription>
              Fill in the details for your new quiz. You can add questions after creating the quiz.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateQuiz} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newQuiz.description}
                onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                value={newQuiz.timeLimit}
                onChange={(e) => setNewQuiz({ ...newQuiz, timeLimit: e.target.value })}
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Quiz</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
