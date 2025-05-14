
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "@/components/forms/RegisterForm";

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">Register for Scholarship Exam</CardTitle>
          <p className="text-center text-sm text-gray-500">
            Create an account to take the scholarship exam
          </p>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <div className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline font-medium">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
