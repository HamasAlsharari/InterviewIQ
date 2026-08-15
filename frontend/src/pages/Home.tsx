import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { Upload, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

interface InterviewQuestion {
  id: number;
  question: string;
}

function Home() {
  const [cvText, setCvText] = useState("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingIndex, setCheckingIndex] = useState<number | null>(null);
  const [interviewId, setInterviewId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const response = await api.post("/api/interview/generate", {
        cv_text: cvText,
        user_id: user.id,
      });

      setQuestions(response.data.questions);

      setAnswers(
        new Array(response.data.questions.length).fill("")
      );

      setFeedback(
        new Array(response.data.questions.length).fill("")
      );

    } catch (error) {
      console.error(error);
      alert("Failed to generate interview questions.");
    }

    setLoading(false);
  };



  const handleEvaluate = async (index: number) => {
    setCheckingIndex(index);
    try {
      const response = await api.post("/api/interview/evaluate", {
        question_id: questions[index].id,
        question: questions[index].question,
        answer: answers[index],
      });

      setInterviewId(response.data.interview_id);

      const temp = [...feedback];
      temp[index] = response.data.feedback;
      setFeedback(temp);
      setCheckingIndex(null);

    } catch (error) {
      console.error(error);
      alert("Failed to evaluate answer.");
      setCheckingIndex(null);
    }
  };

  const getScoreColor = (feedbackText: string) => {
    const match = feedbackText.match(/Score:\s*(\d+)\/10/);

    if (!match) return "border-blue-500";

    const score = parseInt(match[1]);

    if (score >= 8) return "border-green-500";
    if (score >= 5) return "border-yellow-500";

    return "border-red-500";
  };

  const getProgressColor = (feedbackText: string) => {
    const match = feedbackText.match(/Score:\s*(\d+)\/10/);

    if (!match) return "#3b82f6";

    const score = Number(match[1]);

    if (score >= 8) return "#22c55e";
    if (score >= 5) return "#eab308";

    return "#ef4444";
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">

        <div className="max-w-6xl mx-auto px-6 py-20">

          <div className="text-center">

            <div className="flex justify-center mb-6">

              <div className="bg-blue-100 p-5 rounded-full">

                <Sparkles
                  size={42}
                  className="text-blue-600"
                />

              </div>

            </div>

            <h1 className="text-6xl font-extrabold text-gray-900">
              AI Mock Interview
            </h1>

            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your resume and let AI generate realistic technical
              interview questions with instant AI feedback.
            </p>


            <label
              htmlFor="cv-upload"
              className="mt-10 mx-auto w-full max-w-2xl cursor-pointer block"
            >

              <div className="border-2 border-dashed border-blue-300 rounded-2xl bg-white p-12 hover:border-blue-500 hover:bg-blue-50 transition duration-300">

                <Upload
                  className="mx-auto text-blue-600"
                  size={60}
                />

                <h3 className="mt-6 text-2xl font-bold text-gray-800">
                  Upload Your Resume
                </h3>

                <p className="mt-3 text-gray-500">
                  PDF or TXT • Click to browse
                </p>

                {cvText && (
                  <p className="mt-5 text-green-600 font-semibold">
                    ✅ Resume uploaded successfully
                  </p>
                )}

              </div>

            </label>

            <input
              id="cv-upload"
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                if (file.type === "application/pdf") {

                  const arrayBuffer = await file.arrayBuffer();

                  const pdf = await pdfjsLib.getDocument({
                    data: arrayBuffer,
                  }).promise;

                  let text = "";

                  for (let i = 1; i <= pdf.numPages; i++) {

                    const page = await pdf.getPage(i);

                    const content = await page.getTextContent();

                    text +=
                      content.items
                        .map((item: any) => item.str)
                        .join(" ") + "\n";
                  }

                  setCvText(text);

                } else {

                  const reader = new FileReader();

                  reader.onload = (event) => {
                    setCvText(event.target?.result as string);
                  };

                  reader.readAsText(file);

                }
              }}
            />


            <button
              onClick={handleGenerate}
              disabled={loading || !cvText}
              className="
    mt-8
    inline-flex
    items-center
    justify-center
    gap-3
    px-10
    py-4
    rounded-2xl
    bg-blue-600
    text-white
    font-semibold
    text-lg
    shadow-lg
    hover:bg-blue-700
    hover:scale-105
    transition-all
    duration-300
    disabled:bg-gray-400
    disabled:cursor-not-allowed
    disabled:hover:scale-100
  "
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Questions
                </>
              )}
            </button>

            {questions.length > 0 && (
              <div className="mt-12 w-2/3 mx-auto text-left">
                <h2 className="text-3xl font-bold mb-6">
                  Interview Questions
                </h2>

                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="
    mb-8
    bg-white
    rounded-2xl
    shadow-lg
    border
    border-gray-200
    p-8
    hover:shadow-xl
    transition-all
    duration-300
  "
                  >
                    <div className="flex items-start gap-4 mb-6">

                      <div
                        className="
      w-10
      h-10
      rounded-full
      bg-blue-600
      text-white
      flex
      items-center
      justify-center
      font-bold
      text-lg
      shadow
    "
                      >
                        {index + 1}
                      </div>

                      <div>

                        <p className="text-sm text-gray-500 mb-1">
                          Technical Question
                        </p>

                        <h3 className="text-xl font-bold text-gray-800 leading-relaxed">
                          {question.question}
                        </h3>

                      </div>

                    </div>

                    <div className="mt-5">

                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        Your Answer
                      </label>

                      <textarea
                        rows={7}
                        className="
      w-full
      rounded-2xl
      border
      border-gray-300
      bg-gray-50
      p-5
      text-gray-700
      leading-7
      resize-none
      focus:bg-white
      focus:ring-4
      focus:ring-blue-200
      focus:border-blue-500
      outline-none
      transition-all
      duration-300
    "
                        placeholder="Type your answer here..."
                        value={answers[index]}
                        onChange={(e) => {
                          const temp = [...answers];
                          temp[index] = e.target.value;
                          setAnswers(temp);
                        }}
                      />

                    </div>

                    <button
                      onClick={() => handleEvaluate(index)}
                      disabled={checkingIndex === index}
                      className="
    mt-5
    inline-flex
    items-center
    justify-center
    gap-2
    bg-green-600
    hover:bg-green-700
    text-white
    font-semibold
    px-6
    py-3
    rounded-xl
    shadow
    transition-all
    duration-300
    disabled:bg-gray-400
    disabled:cursor-not-allowed
  "
                    >
                      {checkingIndex === index ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Analyzing...
                        </>
                      ) : (
                        "Check Answer"
                      )}
                    </button>
                    {feedback[index] && (
                      <div
                        className={`
  mt-6
  bg-gray-50
  border-l-4
  ${getScoreColor(feedback[index])}
  rounded-xl
  p-5
  whitespace-pre-wrap
`}
                      >
                        <h4 className="text-lg font-bold text-gray-800 mb-3">
                          🤖 AI Feedback
                        </h4>

                        <div className="space-y-4">

                          <div className="w-full bg-gray-200 rounded-full h-3">

                            <div
                              className="h-3 rounded-full"
                              style={{
                                backgroundColor: getProgressColor(feedback[index]),
                                width: `${(() => {
                                  const match = feedback[index].match(/Score:\s*(\d+)\/10/);

                                  if (!match) return 0;

                                  return Number(match[1]) * 10;
                                })()}%`,
                              }}
                            />

                          </div>

                          <p className="whitespace-pre-wrap text-gray-700">
                            {feedback[index]}
                          </p>

                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {questions.length > 0 &&
              feedback.every((f) => f !== "") &&
              interviewId && (
                <div className="text-center mt-10">
                  <button
                    onClick={() =>
                      navigate("/interview-result", {
                        state: {
                          interviewId,
                        },
                      })
                    }
                    className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          font-semibold
          text-lg
          px-10
          py-4
          rounded-2xl
          shadow-lg
          transition-all
          duration-300
        "
                  >
                    Finish Interview
                  </button>
                </div>
              )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;