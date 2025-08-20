const Contact = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col bg-white py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-quiz-blue mb-8">
          Connect with Us
        </h1>

        <ul className="space-y-4 text-gray-700">
          <li>🌐 Website: <a href="https://codeentra.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">codeentra.com</a></li>
          <li>📧 Email: <a href="mailto:codeentra.oversight144@slmail.me" className="text-blue-600 hover:underline">codeentra.oversight144@slmail.me</a></li>
          <li>🔗 LinkedIn: <a href="https://linkedin.com/company/codeentra" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">linkedin.com/company/codeentra</a></li>
          <li>📱 Instagram: <a href="https://instagram.com/codeentra" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">instagram.com/codeentra</a></li>
          <li>🐦 Twitter/X: <a href="https://twitter.com/codeentra" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">twitter.com/codeentra</a></li>
          <li>📞 Contact:{" "}<a href="tel:+919608758841" className="text-blue-600 hover:underline">+91-9608758841</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Contact;
