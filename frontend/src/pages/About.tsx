const About = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-quiz-blue mb-8">
          About College Exam Portal
        </h1>

        <p className="mb-4 text-gray-700">
          <strong>College Name:</strong> Dashrath Prasad Singh Group of Institutions (DPSGI)
        </p>
        <p className="mb-4 text-gray-700">
          <strong>College Exam Portal</strong> is a modern online exam management system
          designed for DPSGI to make exams easy, secure, and paperless. Through this portal,
          students can take exams from anywhere, and teachers can easily create tests and
          publish results.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>✔ User-friendly interface</li>
          <li>✔ Secure student login</li>
          <li>✔ Automated result generation</li>
          <li>✔ Anytime, anywhere access</li>
        </ul>

        <p className="mt-6 mb-4 text-gray-700">
          This portal is designed and developed by <strong>CodeEntra</strong>.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">About CodeEntra</h2>
        <p className="mb-4 text-gray-700">
          CodeEntra is a trusted IT company that builds custom portals and digital
          solutions for schools, colleges, and universities. Our team focuses on making
          every solution secure, scalable, and easy to use so that institutions can
          manage exams and academics more efficiently.
        </p>
        <p className="text-gray-700">
          <strong>Our Mission:</strong> Empowering education through smart technology.
        </p>
      </div>
    </div>
  );
};

export default About;
