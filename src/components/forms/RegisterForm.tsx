
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CourseSelector from "./CourseSelector";
import { useAuth } from "@/contexts/AuthContext";
import OTPVerification from "./OTPVerification";

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  
  const { register, sendOTP, authState } = useAuth();
  const { isLoading, error } = authState;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    if (!selectedCourse) {
      setPasswordError("Please select a course");
      return;
    }
    
    try {
      // Send OTP for verification
      await sendOTP(email);
      setShowOtpVerification(true);
    } catch (error) {
      setPasswordError("Failed to send verification code. Please try again.");
    }
  };
  
  const handleVerificationComplete = async () => {
    // Complete the registration process
    await register({ 
      name, 
      email, 
      password, 
      courseId: selectedCourse 
    });
    
    if (onSuccess && !error) {
      onSuccess();
    }
  };
  
  if (showOtpVerification) {
    return (
      <OTPVerification 
        email={email}
        onVerified={handleVerificationComplete}
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
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <Button type="submit" disabled={isLoading} className="w-full mt-2">
          {isLoading ? "Creating Account..." : "Continue"}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
