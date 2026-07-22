import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://127.0.0.1:8000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Navbar />

      <div className="text-center mt-20">
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        {user && (
          <div className="mt-6 text-xl">
            Welcome <b>{user.full_name}</b> 👋
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;