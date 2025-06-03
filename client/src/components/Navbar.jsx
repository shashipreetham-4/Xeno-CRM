import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Navbar = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const initial = user?.email?.[0]?.toUpperCase() || "U";

  const handleLogout = () => {
    onLogout(); // trigger parent logout
    navigate("/");
  };

  // Auto-close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center px-8 py-5 bg-white border-b border-blue-200 shadow-md sticky top-0 z-50">
      {/* ✨ Gradient Brand Name */}
      <Link
        to="/dashboard"
        className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text tracking-wide drop-shadow-sm hover:opacity-90 transition-all duration-300"
      >
        Xeno CRM
      </Link>

      <nav className="flex gap-8 items-center text-base font-semibold text-gray-700">
        <Link
          to="/dashboard"
          className="relative group px-2 py-1 hover:text-blue-600 transition-colors duration-300"
        >
          Dashboard
          <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>

        <Link
          to="/customers"
          className="relative group px-2 py-1 hover:text-blue-600 transition-colors duration-300"
        >
          Customers
          <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>

        <Link
          to="/segments/new"
          className="relative group px-2 py-1 hover:text-blue-600 transition-colors duration-300"
        >
          Segments
          <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>

        <Link
          to="/campaigns"
          className="relative group px-2 py-1 hover:text-blue-600 transition-colors duration-300"
        >
          Campaigns
          <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>

        {/* 👤 Avatar Button + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg cursor-pointer hover:bg-blue-700 transition-shadow shadow-md hover:shadow-lg"
          >
            {initial}
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
