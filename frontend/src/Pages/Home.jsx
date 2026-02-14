import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      
      <header className="flex justify-between items-center px-8 py-4">
        <h1 className="text-3xl font-bold text-blue-400">PortfolioHub</h1>
        <nav className="space-x-6">
          <Link to="/login" className="hover:text-blue-400">Login</Link>
          <Link to="/signup" className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">Sign Up</Link>
        </nav>
      </header>

      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
          Showcase Your <span className="text-blue-500">Skills</span> & <span className="text-purple-500">Projects</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
          PortfolioHub is your digital identity. Build your portfolio, share projects, and highlight your journey as a developer.
        </p>
        <div className="flex space-x-4">
          <Link to="/signup" className="px-6 py-3 bg-blue-500 rounded-lg text-lg hover:bg-blue-600 transition">Get Started</Link>
          <a href="#projects" className="px-6 py-3 border border-gray-400 rounded-lg text-lg hover:border-blue-400 transition">View Projects</a>
        </div>
      </main>

      
      <footer className="py-4 text-center text-gray-500 text-sm">
        © 2025 PortfolioHub. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
