import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function InterviewResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { interviewId } = location.state || {};

  if (!interviewId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No interview found.
      </div>
    );
  }

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!interviewId) return;

    api
      .get(`/api/interview/result/${interviewId}`)
      .then((res) => {
        setResult(res.data);
      })
      .catch(console.error);
  }, [interviewId]);

  const scores = result?.questions
    ?.map((q: any) => Number(q.score))
    .filter((score: number) => !isNaN(score)) ?? [];

  const score =
    scores.length > 0
      ? scores.reduce((sum: number, score: number) => sum + score, 0) /
      scores.length
      : 0;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const scoreNumber = Number(score);

  const scoreColor =
    scoreNumber >= 8
      ? "text-green-600"
      : scoreNumber >= 5
        ? "text-yellow-500"
        : "text-red-500";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">

      <div className="max-w-4xl mx-auto px-6 py-16">

        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-blue-600 font-semibold"
        >
          ← Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-10">

          <h1 className="text-4xl font-bold mb-10">
            Interview Result
          </h1>


          <div className="mb-8">

            <h2 className="font-bold text-xl mb-2">
              Overall Score
            </h2>

            <div className={`text-6xl font-bold ${scoreColor}`}>
              {score.toFixed(1)}/10
            </div>

          </div>


          <div className="mt-10">

            <a
              href={`http://localhost:8000/api/report/${interviewId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
      inline-flex
      items-center
      justify-center
      px-8
      py-4
      rounded-2xl
      bg-red-600
      hover:bg-red-700
      text-white
      font-semibold
      shadow-lg
      transition-all
      duration-300
    "
              onClick={(e) => {
                e.preventDefault();

                fetch(
                  `http://localhost:8000/api/report/${interviewId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                  .then((response) => {
                    return response.blob();
                  })
                  .then((blob) => {
                    const url = window.URL.createObjectURL(blob);

                    const a = document.createElement("a");

                    a.href = url;
                    a.download = "Interview_Report.pdf";
                    a.click();
                  });
              }}

            >
              📄 Download PDF Report
            </a>

          </div>

        </div>

      </div>

    </div >
  );
}

export default InterviewResult;