import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-5 bg-white shadow-sm">

      <Link
        to={token ? "/dashboard" : "/login"}
        className="text-3xl font-bold text-blue-600"
      >
        InterviewIQ
      </Link>

      <div className="flex items-center gap-4">

        {!token ? (
          <>
            <Link
              to="/login"
              className="font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl bg-red-100 text-red-700 font-medium hover:bg-red-200 transition"
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;