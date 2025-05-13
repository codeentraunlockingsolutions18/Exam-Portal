
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
  const { sendOTP, verifyOTP } = useAuth();

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
    
    try {
      const success = await verifyOTP(email, otp);
      
      if (success) {
        toast({
          title: "Email verified",
          description: "Your email has been successfully verified.",
        });
        
        onVerified();
      }
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleResendOTP = async () => {
    setResendDisabled(true);
    setCountdown(30);
    
    try {
      await sendOTP(email);
      
      toast({
        title: "OTP resent",
        description: `A new verification code has been sent to ${email}`,
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
    } catch (error) {
      toast({
        title: "Failed to resend OTP",
        description: "Please try again",
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
          We've sent a 6-digit code to {email}
        </p>
      </div>
      
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isVerifying}>
            Back
          </Button>
          <Button type="submit" disabled={isVerifying || otp.length !== 6}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </form>
      
      <div className="text-center">
        <Button 
          variant="link" 
          onClick={handleResendOTP} 
          disabled={resendDisabled}
          className="text-sm"
        >
          {resendDisabled 
            ? `Resend code in ${countdown}s` 
            : "Didn't receive code? Resend"}
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
