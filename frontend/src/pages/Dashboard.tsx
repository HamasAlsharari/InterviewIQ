import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Briefcase,
  Trophy,
  Clock,
  Play,
} from "lucide-react";

interface Interview {
  id: number;
  title: string;
  average_score: number;
  created_at: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const chartData = interviews.map((interview, index) => ({
    interview: `Interview ${index + 1}`,
    score: interview.average_score,
  }));

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadDashboard();
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInterviews(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">

            <h1 className="text-4xl font-bold">
              Dashboard
            </h1>

            <button
              onClick={() => navigate("/")}
              className="
      inline-flex
      items-center
      gap-2
      bg-blue-600
      hover:bg-blue-700
      text-white
      px-6
      py-3
      rounded-xl
      font-semibold
      shadow-lg
      transition-all
      duration-300
    "
            >
              <Play size={18} />
              Start New Interview
            </button>

          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">

            <div className="
bg-white
rounded-2xl
shadow-lg
p-6
flex
items-center
justify-between
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
">
              <div>
                <p className="text-gray-500">
                  Total Interviews
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {interviews.length}
                </h2>
              </div>

              <div className="bg-blue-100 p-4 rounded-xl">
                <Briefcase
                  className="text-blue-600"
                  size={30}
                />
              </div>
            </div>

            <div
              className="
bg-white
rounded-2xl
shadow-lg
p-6
flex
items-center
justify-between
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
"
            >

              <div>

                <p className="text-gray-500">
                  Average Score
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {
                    interviews.length > 0
                      ? (
                        interviews.reduce(
                          (sum, interview) =>
                            sum + interview.average_score,
                          0
                        ) / interviews.length
                      ).toFixed(1)
                      : 0
                  }
                </h2>

              </div>

              <div className="bg-green-100 p-4 rounded-xl">

                <Trophy
                  className="text-green-600"
                  size={30}
                />

              </div>

            </div>

            <div
              className="
bg-white
rounded-2xl
shadow-lg
p-6
flex
items-center
justify-between
hover:shadow-xl
hover:-translate-y-1
transition-all
duration-300
"
            >

              <div>

                <p className="text-gray-500">
                  Latest Interview
                </p>

                <h2 className="text-xl font-bold mt-2">
                  {
                    interviews.length > 0
                      ? interviews[0].title
                      : "-"
                  }
                </h2>

              </div>

              <div className="bg-orange-100 p-4 rounded-xl">

                <Clock
                  className="text-orange-600"
                  size={30}
                />

              </div>

            </div>

          </div>

          <div className="
bg-white
rounded-2xl
shadow-lg
p-8
mb-8
">

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Interview Scores
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <LineChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="interview" />

                <YAxis domain={[0, 10]} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>

          <div className="
bg-white
rounded-2xl
shadow-lg
p-8
">

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Interview History
            </h2>

            <table className="w-full border-collapse">

              <thead>

                <tr className="border-b text-gray-500 uppercase text-sm">

                  <th className="text-left py-2">
                    Title
                  </th>

                  <th className="text-left py-2">
                    Score
                  </th>

                  <th className="text-left py-2">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {interviews.length === 0 ? (

                  <tr>

                    <td
                      colSpan={3}
                      className="py-8 text-center text-gray-400"
                    >
                      No interviews yet.
                    </td>

                  </tr>

                ) : (

                  interviews.map((interview) => (

                    <tr
                      key={interview.id}
                      className="
          border-b
          hover:bg-blue-50
          transition-colors
        "
                    >

                      <td className="py-4 font-medium text-gray-700">
                        {interview.title}
                      </td>

                      <td>

                        <span
                          className={`
              px-3
              py-1
              rounded-full
              text-white
              text-sm
              font-semibold
              ${interview.average_score >= 8
                              ? "bg-green-500"
                              : interview.average_score >= 5
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }
            `}
                        >
                          {interview.average_score}/10
                        </span>

                      </td>

                      <td className="text-gray-500">

                        {new Date(
                          interview.created_at
                        ).toLocaleDateString("en-GB")}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;