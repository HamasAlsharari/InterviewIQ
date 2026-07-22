import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      console.log("Response:");
      console.log(response.data);

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      console.log("Saved Token:");
      console.log(localStorage.getItem("token"));

      alert("Login successful!");

      navigate("/dashboard");

    } catch (error: any) {
      console.log(error);

      alert(
        error.response?.data?.detail || "Login failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center mt-20">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

          <h1 className="text-3xl font-bold text-center mb-8">
            Login
          </h1>

          <form className="space-y-5" onSubmit={handleLogin}>

            <div>
              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-lg p-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border rounded-lg p-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>

          </form>

        </div>
      </div>
    </>
  );
}

export default Login;