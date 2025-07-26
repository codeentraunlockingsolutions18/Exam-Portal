import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CourseSelector from "./CourseSelector";
import { useRegisterUser } from "@/data/courses";

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    selectedCourse: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCourseSelect = (courseId: string) => {
    setFormData((prev) => ({ ...prev, selectedCourse: courseId }));
  };

const { registerUser, loading, error, success } = useRegisterUser();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const payload = {
    name: formData.name,
    email: formData.email,
     course_id: formData.selectedCourse,
    password: formData.password,
   
  };

  await registerUser(payload);
};


  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   handleRegister();
  // };

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
            value={formData.name}
            onChange={handleChange}
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
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <CourseSelector
          selectedCourse={formData.selectedCourse}
          onSelectCourse={handleCourseSelect}
          disabled={isLoading}
        />

        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
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
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        </div>

        {apiError && <div className="text-red-500 text-sm">{apiError}</div>}

        <Button type="submit" disabled={isLoading} className="w-full mt-2">
          {isLoading ? "Creating Account..." : "Register"}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
