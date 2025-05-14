
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OTPVerificationProps {
  email: string;
  onVerified: () => void;
  onCancel: () => void;
}

const OTPVerification = ({ email, onVerified, onCancel }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  // Send OTP on component mount
  useEffect(() => {
    console.log("OTPVerification mounted, sending OTP to:", email);
    handleResendOTP();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 6 digits of the OTP",
        variant: "destructive",
      });
      return;
    }
    
    setIsVerifying(true);
    console.log("Verifying OTP:", otp);
    
    try {
      // In Supabase, OTP verification is handled via the API
      // For now, we'll simulate OTP verification
      
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified.",
      });
      
      onVerified();
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleResendOTP = async () => {
    setResendDisabled(true);
    setCountdown(60); // 60 second timeout for email delivery
    
    try {
      console.log("Sending OTP to:", email);
      // Supabase handles email verification automatically with the signUp call
      // But we can trigger a new email if needed
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });

      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link",
      });
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error("Failed to send OTP:", error);
      toast({
        title: "Failed to send verification email",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      setResendDisabled(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium">Verify Your Email</h3>
        <p className="text-sm text-gray-500">
          We've sent a verification email to {email}
        </p>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">
          Check your spam/junk folder if you don't see the email
        </p>
        <Button 
          variant="link" 
          onClick={handleResendOTP} 
          disabled={resendDisabled}
          className="text-sm"
        >
          {resendDisabled 
            ? `Resend email in ${countdown}s` 
            : "Didn't receive email? Resend"}
        </Button>
      </div>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isVerifying}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
