
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface QuestionFormProps {
  onSave: (questionData: any) => Promise<void>;
  onCancel: () => void;
}

const QuestionForm = ({ onSave, onCancel }: QuestionFormProps) => {
  const [activeTab, setActiveTab] = useState("text");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Text question state
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  
  // Image question state
  const [questionImage, setQuestionImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageOptions, setImageOptions] = useState([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  
  const handleOptionChange = (index: number, text: string, isImage: boolean = false) => {
    if (isImage) {
      const newOptions = [...imageOptions];
      newOptions[index] = { ...newOptions[index], text };
      setImageOptions(newOptions);
    } else {
      const newOptions = [...options];
      newOptions[index] = { ...newOptions[index], text };
      setOptions(newOptions);
    }
  };
  
  const handleCorrectOptionChange = (index: number, isImage: boolean = false) => {
    if (isImage) {
      const newOptions = imageOptions.map((option, i) => ({
        ...option,
        isCorrect: i === index,
      }));
      setImageOptions(newOptions);
    } else {
      const newOptions = options.map((option, i) => ({
        ...option,
        isCorrect: i === index,
      }));
      setOptions(newOptions);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.includes("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    
    setQuestionImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const validateForm = (isImageQuestion: boolean) => {
    if (isImageQuestion) {
      if (!questionImage) {
        toast({
          title: "Missing image",
          description: "Please upload a question image",
          variant: "destructive",
        });
        return false;
      }
      
      const emptyOptions = imageOptions.filter(o => !o.text.trim());
      if (emptyOptions.length > 0) {
        toast({
          title: "Incomplete options",
          description: "All options must have text",
          variant: "destructive",
        });
        return false;
      }
    } else {
      if (!questionText.trim()) {
        toast({
          title: "Missing question",
          description: "Please enter a question",
          variant: "destructive",
        });
        return false;
      }
      
      const emptyOptions = options.filter(o => !o.text.trim());
      if (emptyOptions.length > 0) {
        toast({
          title: "Incomplete options",
          description: "All options must have text",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isImageQuestion = activeTab === "image";
    
    if (!validateForm(isImageQuestion)) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare the question data based on type
      const questionData = isImageQuestion 
        ? { 
            type: "image", 
            image: questionImage,
            options: imageOptions 
          }
        : { 
            type: "text", 
            text: questionText, 
            options: options 
          };
      
      // Call the onSave callback with question data
      await onSave(questionData);
      
      toast({
        title: "Question saved",
        description: "The question has been added successfully.",
      });
      
      // Reset form
      setQuestionText("");
      setQuestionImage(null);
      setImagePreview(null);
      setOptions([
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
      setImageOptions([
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
      
    } catch (error: any) {
      toast({
        title: "Failed to save question",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Text Question</TabsTrigger>
          <TabsTrigger value="image">Image Question</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="question-text">Question Text</Label>
            <Textarea
              id="question-text"
              placeholder="Enter your question here"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div className="space-y-3">
            <Label>Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <Checkbox 
                  checked={option.isCorrect} 
                  onCheckedChange={() => handleCorrectOptionChange(index)} 
                  id={`option-${index}`}
                />
                <Label htmlFor={`option-${index}`} className="flex-grow-0">
                  Correct
                </Label>
                <Input
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-grow"
                />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="image" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="question-image">Question Image</Label>
            <div className="mt-1 flex items-center space-x-4">
              <Input
                id="question-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            
            {imagePreview && (
              <Card className="mt-3">
                <CardContent className="p-3">
                  <img 
                    src={imagePreview} 
                    alt="Question preview" 
                    className="max-h-40 object-contain mx-auto"
                  />
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-3">
            <Label>Options</Label>
            {imageOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <Checkbox 
                  checked={option.isCorrect} 
                  onCheckedChange={() => handleCorrectOptionChange(index, true)} 
                  id={`img-option-${index}`}
                />
                <Label htmlFor={`img-option-${index}`} className="flex-grow-0">
                  Correct
                </Label>
                <Input
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value, true)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-grow"
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Question"}
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
