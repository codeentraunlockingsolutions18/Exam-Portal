
import { Link,useLocation } from "react-router-dom";

const Footer = () => {

const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // Otherwise, navigation to "/" will happen automatically
  };


  return (
    <footer className="mt-auto border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-quiz-blue">
              ExamEntra
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              Test your knowledge with interactive quizzes
            </p>
          </div>
          
          <div className="flex gap-6">
            <Link to="/" onClick={handleHomeClick} className="text-sm text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <Link to="/about" className="text-sm text-gray-500 hover:text-gray-700">
              About
            </Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-700">
              Contact
            </Link>
          </div>
        </div>
        
        <div className="text-center mt-6 text-xs text-gray-400">
          © {new Date().getFullYear()} QuizMaster. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
