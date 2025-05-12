
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Mic, Camera } from "lucide-react";
import { useQuiz } from "@/contexts/QuizContext";
import { useToast } from "@/components/ui/use-toast";

const QuizDetails = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuiz, startQuiz } = useQuiz();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  
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
  
  const handleRequestPermissions = async () => {
    setShowPermissionsDialog(true);
  };

  const handleEnableMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicEnabled(true);
      // Stop the stream to release the microphone
      stream.getTracks().forEach(track => track.stop());
      toast({
        title: "Microphone enabled",
        description: "Your microphone is now enabled for the exam.",
      });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access in your browser settings.",
        variant: "destructive",
      });
    }
  };

  const handleEnableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraEnabled(true);
      // Stop the stream to release the camera
      stream.getTracks().forEach(track => track.stop());
      toast({
        title: "Camera enabled",
        description: "Your camera is now enabled for the exam.",
      });
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access in your browser settings.",
        variant: "destructive",
      });
    }
  };
  
  const handleStartQuiz = async () => {
    if (!micEnabled || !cameraEnabled) {
      setShowPermissionsDialog(true);
      return;
    }
    
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
              <li>Webcam and microphone must be enabled for the duration of the exam.</li>
            </ul>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row gap-6 justify-center">
            <div className={`border p-4 rounded-lg flex flex-col items-center gap-2 ${micEnabled ? 'bg-green-50 border-green-300' : 'bg-gray-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${micEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Mic className={`w-6 h-6 ${micEnabled ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <p className="font-medium">{micEnabled ? 'Microphone Enabled' : 'Microphone Required'}</p>
              <Button 
                onClick={handleEnableMic}
                variant={micEnabled ? "outline" : "default"}
                size="sm"
              >
                {micEnabled ? 'Enabled' : 'Enable Microphone'}
              </Button>
            </div>
            
            <div className={`border p-4 rounded-lg flex flex-col items-center gap-2 ${cameraEnabled ? 'bg-green-50 border-green-300' : 'bg-gray-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cameraEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Camera className={`w-6 h-6 ${cameraEnabled ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <p className="font-medium">{cameraEnabled ? 'Camera Enabled' : 'Camera Required'}</p>
              <Button 
                onClick={handleEnableCamera}
                variant={cameraEnabled ? "outline" : "default"}
                size="sm"
              >
                {cameraEnabled ? 'Enabled' : 'Enable Camera'}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartQuiz} className="w-full quiz-button-primary">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permissions Required</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">To ensure exam integrity, we require access to your microphone and camera. Please enable both before continuing.</p>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  <span>Microphone</span>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${micEnabled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {micEnabled ? 'Enabled' : 'Required'}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  <span>Camera</span>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${cameraEnabled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {cameraEnabled ? 'Enabled' : 'Required'}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPermissionsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartQuiz} disabled={!micEnabled || !cameraEnabled}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizDetails;
