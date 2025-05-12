
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/forms/LoginForm";

const Login = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-quiz-blue">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-quiz-blue hover:underline">
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Login;
