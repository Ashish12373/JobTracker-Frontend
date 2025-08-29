const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-8">
        About Job Tracker 🚀
      </h1>

      {/* Intro */}
      <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12 leading-relaxed">
        Job Tracker is a  <span className="font-semibold text-blue-600">full-stack web application<p> </p></span> 
        built to simplify and organize the job search journey.  
        It allows users to register, log in securely, and manage job applications in one place.  
        The app combines the power of <span className="font-semibold">React + Tailwind CSS</span> for a responsive frontend 
        and <span className="font-semibold">Spring Boot + MySQL + JWT</span> for a secure backend.
      </p>

      {/* Tech Stack Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">🔧 Frontend</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            <li>⚛️ <strong>React</strong> for building dynamic UI components</li>
            <li>🎨 <strong>Tailwind CSS</strong> for responsive, theme-aware design</li>
            <li>🌗 <strong>ThemeProvider</strong> with Context API for dark/light mode</li>
            <li>🛣️ <strong>React Router DOM</strong> for static & dynamic routing</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-green-600 mb-4">🖥️ Backend</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            <li>☕ <strong>Spring Boot</strong> for REST APIs</li>
            <li>🗄️ <strong>MySQL Database</strong> for persistent job storage</li>
            <li>🔐 <strong>JWT Authentication</strong> for secure login/signup</li>
            <li>⚡ <strong>BCrypt</strong> password hashing for security</li>
          </ul>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-8 shadow-lg mb-12">
        <h2 className="text-2xl font-bold mb-4">✨ Key Features</h2>
        <ul className="space-y-2">
          <li>➕ Add, edit, and track job applications in real time</li>
          <li>🌗 Toggle between light and dark modes</li>
          <li>🔑 Secure login & signup using JWT authentication</li>
          <li>📊 Each user has their own job dashboard at <code>/:username/jobs</code></li>
          <li>🚀 Deployed with CORS enabled for frontend-backend communication</li>
        </ul>
      </div>

      {/* Concept Explanation */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold text-purple-600 mb-4">⚙️ Core Concepts</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The app demonstrates <strong>state management</strong> with React hooks 
            (<code>useState</code>, <code>useContext</code>), secure <strong>JWT auth</strong>, 
            protected routes with <code>ProtectedRoute</code>, and dynamic routing using 
            <code>/:username/jobs</code>. Tailwind’s <code>dark:</code> variants ensure 
            seamless theme switching.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold text-teal-600 mb-4">🎯 Purpose</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Job hunting can be chaotic. This project provides an organized platform to 
            track roles, applications, interviews, and recruiter details, while practicing 
            <strong>real-world full-stack development concepts</strong>.
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-gray-500 dark:text-gray-400 italic">
        Built with ❤️ using React, Tailwind, Spring Boot, and MySQL
      </p>
    </div>
  );
};

export default About;
