
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              College Scholarship Exam Portal
            </h1>
            <p className="text-xl mb-8">
              Apply for scholarships by demonstrating your knowledge in our online assessments.
              Register, select your course, and take the exam to qualify.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Apply for Scholarship
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Scholarship Program</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Financial Support</h3>
              <p className="text-gray-600">
                Top performers receive substantial financial aid covering up to 100% of tuition fees.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg shadow-md">
              <div className="bg-purple-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Merit-Based Selection</h3>
              <p className="text-gray-600">
                Fair and transparent selection process based entirely on your exam performance.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg shadow-md">
              <div className="bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Multiple Programs</h3>
              <p className="text-gray-600">
                Scholarships available across various disciplines including Computer Science, Engineering, Business, Arts, and Medical Sciences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-bold mb-2">Register</h3>
              <p className="text-gray-600">Create an account and select your preferred course of study</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-bold mb-2">Take Exam</h3>
              <p className="text-gray-600">Complete the scholarship exam for your chosen program</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-bold mb-2">Get Results</h3>
              <p className="text-gray-600">View your score and scholarship eligibility instantly</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-bold mb-2">Enroll</h3>
              <p className="text-gray-600">Qualified students receive admission with scholarship details</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Apply for a Scholarship?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have secured scholarships through our examination platform.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Application
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
