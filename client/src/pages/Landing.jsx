import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 text-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 bg-white shadow-md sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold tracking-wide text-blue-700">Xeno CRM</h1>
        <Link to="/login">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300 font-semibold">
            Login / Signup
          </button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 max-w-5xl mx-auto text-center space-y-8 py-20">
        <div className="bg-white bg-opacity-80 rounded-xl shadow-xl p-12 max-w-3xl backdrop-blur-md border border-gray-200">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gradient bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent mb-4 leading-tight">
            Smarter Campaigns, Stronger Retention
          </h2>
          <p className="text-gray-700 text-lg md:text-xl max-w-xl mx-auto mb-8 tracking-wide">
            Xeno CRM supercharges your customer engagement with <span className="font-semibold text-green-600">AI-powered campaign automation</span>, dynamic audience segmentation, and real-time analytics — all streamlined in one elegant platform.
          </p>

          <div className="flex justify-center gap-6">
            <Link to="/login">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg shadow-lg hover:bg-green-700 transition">
                Get Started
              </button>
            </Link>
            <Link to="/features">
              <button className="bg-transparent border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg hover:bg-green-600 hover:text-white transition">
                Explore Features
              </button>
            </Link>
          </div>
        </div>

        {/* Cards Section */}
        <section className="flex flex-col md:flex-row justify-center gap-8 mt-16 max-w-5xl w-full px-4">
          {/* Card 1 */}
          <div className="flex-1 bg-white rounded-xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition duration-300">
            <h3 className="text-2xl font-semibold mb-3 text-blue-700">Dynamic Segmentation</h3>
            <p className="text-gray-600 leading-relaxed">
              Create precise audience groups based on behavior, demographics, and AI insights — so your messages hit the right inbox every time.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex-1 bg-white rounded-xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition duration-300">
            <h3 className="text-2xl font-semibold mb-3 text-green-600">AI-Driven Messaging</h3>
            <p className="text-gray-600 leading-relaxed">
              Let our AI craft persuasive campaign messages tailored to your goals — whether it’s boosting sales, re-engaging customers, or announcing new products.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex-1 bg-white rounded-xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition duration-300">
            <h3 className="text-2xl font-semibold mb-3 text-purple-600">Real-Time Analytics</h3>
            <p className="text-gray-600 leading-relaxed">
              Track open rates, click-throughs, and conversions live. Optimize campaigns on the fly with data that actually matters.
            </p>
          </div>
        </section>

        {/* Nested Card (AI Highlight) */}
        <section className="mt-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-200 to-blue-200 rounded-2xl p-1 shadow-lg">
            <div className="bg-white rounded-xl p-10 shadow-inner border border-gray-300">
              <h3 className="text-3xl font-bold mb-4 text-center text-green-700">
                Meet Your AI Campaign Assistant 🤖
              </h3>
              <p className="text-gray-700 text-center max-w-xl mx-auto mb-6 leading-relaxed">
                Powered by cutting-edge AI, Xeno's assistant helps you craft, schedule, and optimize campaigns that feel personal and natural — saving you hours and boosting ROI.
              </p>
              <div className="flex justify-center">
                <Link to="/ai-demo">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-md font-semibold">
                    See AI in Action
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-6 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Xeno CRM — Designed for your growth 🚀
      </footer>
    </div>
  );
};

export default Landing;
