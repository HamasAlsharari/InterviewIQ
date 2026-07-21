import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/auth/register", {
        full_name: fullName,
        email: email,
        password: password,
      });

      alert(response.data.message);
      console.log(response.data);

    } catch (error) {
      console.error(error);
      alert("Registration failed.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center mt-16">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

          <h1 className="text-3xl font-bold text-center mb-8">
            Create Account
          </h1>

          <form onSubmit={handleRegister} className="space-y-5">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded-lg p-3"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Register
            </button>

          </form>

        </div>
      </div>
    </>
  );
}

export default Register;