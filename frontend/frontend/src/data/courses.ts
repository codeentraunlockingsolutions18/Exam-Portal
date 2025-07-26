import { useEffect, useState } from "react";

// 👇 Course Type
export interface Course {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ Hook 1: Fetch courses
export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/courses");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();

      if (!Array.isArray(json.data)) {
        throw new Error("Invalid response format: 'data' is not an array");
      }

      const data: Course[] = json.data;
      setCourses(data);
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        setError("Failed to parse response as JSON.");
      } else if (err instanceof TypeError) {
        setError("Network error or API endpoint is unreachable.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return { courses, loading, error, fetchCourses };
};

// ✅ Hook 2: Register user
interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  course_id: string;
  role?: string; // optional, defaults to 'admin'
}

export const useRegisterUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const registerUser = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8000/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          role: "admin", // Hardcoded
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Registration failed: ${text}`);
      }

      // Optional: validate response.json() if server returns data
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong during registration.");
      console.error("User registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error, success };
};
