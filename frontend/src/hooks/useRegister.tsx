
import { useState } from "react";
import { callRegisterAPI } from "@/services/authService";

export const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const registerUser = async (payload: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const data = await callRegisterAPI(payload);
      if (data.status === "SUCCESS") {
        setSuccess(true);
      } else {
        setError(data.responseMsg || "Registration failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error, success };
};
