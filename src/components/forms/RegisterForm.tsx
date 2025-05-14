
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CourseSelector from "./CourseSelector";
import { useAuth } from "@/contexts/AuthContext";
import OTPVerification from "./OTPVerification";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [formError, setFormError] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  
  const { register, authState } = useAuth();
  const { isLoading, error } = authState;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    // Form validations
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }
    
    if (!selectedCourse) {
      setFormError("Please select a course");
      return;
    }
    
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }
    
    try {
      console.log("Starting registration process for:", email);
      console.log("Selected course:", selectedCourse);
      
      // Send OTP for verification before completing registration
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            courseId: selectedCourse,
            role: 'user' // Default role for new registrations
          }
        }
      });

      if (signupError) {
        throw signupError;
      }

      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error("Registration error:", error);
      setFormError(error.message || "Something went wrong. Please try again.");
    }
  };
  
  if (showOtpVerification) {
    return (
      <OTPVerification 
        email={email}
        onVerified={() => {
          if (onSuccess) {
            onSuccess();
          }
        }}
        onCancel={() => setShowOtpVerification(false)}
      />
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        <CourseSelector 
          selectedCourse={selectedCourse} 
          onSelectCourse={setSelectedCourse}
          disabled={isLoading}
        />
        
        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          {formError && (
            <p className="text-red-500 text-sm">{formError}</p>
          )}
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <Button type="submit" disabled={isLoading} className="w-full mt-2">
          {isLoading ? "Processing..." : "Register"}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
