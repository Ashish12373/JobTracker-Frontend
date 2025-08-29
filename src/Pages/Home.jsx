import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const username = localStorage.getItem("username"); 
    if (username) {
      navigate(`/${username}/jobs`); 
    } else {
      navigate("/login"); 
    }
  };

  return (
    <main className="flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-[85vh]">
      
      {/* Hero */}
      <h1 className="text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Take Control of Your Job Search 💼
      </h1>

      <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-2xl leading-relaxed">
        Job Tracker is your personal career command center.  
        Keep every job application, recruiter detail, and interview organized in one secure place.  
        Say goodbye to messy spreadsheets — stay focused and land your next role faster.
      </p>

      {/* Highlights */}
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-10 max-w-3xl w-full mb-12">
        <h2 className="text-2xl font-bold text-center text-yellow-500 mb-6">🚀 Why Choose Job Tracker?</h2>
        <ul className="space-y-5 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          <li>📌 <span className="font-semibold">Smart Job Tracking:</span> Save job titles, companies, platforms, application dates, recruiters, and follow-ups in a structured way.</li>
          <li>🎨 <span className="font-semibold">Clean & Responsive UI:</span> Powered by React + Tailwind, optimized for desktop and mobile.</li>
          <li>🌗 <span className="font-semibold">Dark/Light Mode:</span> Work the way you like with theme-aware design.</li>
          <li>🔐 <span className="font-semibold">Secure Authentication:</span> JWT-based login with password encryption ensures your data stays safe.</li>
          <li>📊 <span className="font-semibold">User-Centric Dashboard:</span> Access your personalized job board at <code>/:username/jobs</code>.</li>
          <li>☁️ <span className="font-semibold">Persistent Storage:</span> Your job data is saved in a reliable MySQL database, not lost on refresh.</li>
        </ul>
      </div>

      {/* Call to Action */}
      <button
        onClick={handleGetStarted}
        className="px-10 py-4 rounded-full text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-blue-500 to-indigo-600"
      >
        Get Started Now 🚀
      </button>

      {/* Footer Note */}
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center max-w-xl">
        Whether you’re applying to your first internship or your dream job, Job Tracker helps you stay 
        <span className="font-semibold"> organized, confident, and ready to succeed.</span>
      </p>
    </main>
  );
};

export default Home;
