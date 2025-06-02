import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="flex items-center justify-between px-6 py-4 shadow-sm bg-white">
        <h1 className="text-xl font-bold">Xeno CRM</h1>
        <Link to="/login">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Login / Signup
          </button>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto mt-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Smarter Campaigns, Stronger Retention</h2>
        <p className="text-gray-600 text-lg mb-8">
          Build audience segments, run campaigns, and track engagement — all in one simple dashboard.
        </p>
        <Link to="/login">
          <button className="bg-green-600 text-white px-6 py-3 rounded text-lg hover:bg-green-700">
            Get Started
          </button>
        </Link>
      </main>
    </div>
  );
};

export default Landing;
