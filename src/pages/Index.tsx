
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-quiz-blue to-quiz-purple text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Test Your Knowledge with QuizMaster
            </h1>
            <p className="text-xl mb-8">
              Challenge yourself with our collection of quizzes on various topics.
              Track your progress and improve your skills.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-quiz-purple hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-white hover:bg-white/10">
                  Browse Quizzes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose QuizMaster</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-quiz-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Interactive Quizzes</h3>
              <p className="text-gray-600">
                Engage with our interactive quizzes that make learning fun and effective.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg shadow-md">
              <div className="bg-purple-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-quiz-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Timed Challenges</h3>
              <p className="text-gray-600">
                Test your knowledge under pressure with our timed quiz challenges.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg shadow-md">
              <div className="bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-quiz-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your performance and improvement over time with detailed statistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Test Your Knowledge?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have improved their skills with our interactive quizzes.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-quiz-blue text-white hover:bg-blue-700">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
