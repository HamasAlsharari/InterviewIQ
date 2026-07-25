import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Navbar from "../components/Navbar";
import api from "../services/api";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

function Home() {
  const [cvText, setCvText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const response = await api.post("/api/interview/generate", {
        cv_text: cvText,
      });
      console.log("CV TEXT:");
      console.log(cvText);

      console.log("REQUEST:");
      console.log({
        cv_text: cvText,
      });

      setQuestions(response.data.questions);
      setAnswers(new Array(response.data.questions.length).fill(""));
      setFeedback([]);
    } catch (error) {
      console.error(error);
      alert("Failed to generate interview questions.");
    }

    setLoading(false);
  };

  const handleEvaluate = async (index: number) => {
    try {
      const response = await api.post("/api/interview/evaluate", {
        question: questions[index],
        answer: answers[index],
      });

      const temp = [...feedback];
      temp[index] = response.data.feedback;
      setFeedback(temp);
    } catch (error) {
      console.error(error);
      alert("Failed to evaluate answer.");
    }
  };

  return (
    <>
      <Navbar />

      <section className="text-center mt-24">
        <h1 className="text-6xl font-bold">
          Ace Your Next Interview
        </h1>

        <p className="mt-6 text-xl text-gray-600">
          Upload your CV and generate technical interview questions instantly.
        </p>

        <input
          type="file"
          accept=".pdf,.txt"
          className="mt-8"
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

        <br />

        <button
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
          onClick={handleGenerate}
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>

        {questions.length > 0 && (
          <div className="mt-12 w-2/3 mx-auto text-left">
            <h2 className="text-3xl font-bold mb-6">
              Interview Questions
            </h2>

            {questions.map((question, index) => (
              <div
                key={index}
                className="mb-8 border rounded-lg p-5"
              >
                <h3 className="font-semibold mb-3">
                  {index + 1}. {question}
                </h3>

                <textarea
                  rows={4}
                  className="w-full border rounded p-3"
                  placeholder="Write your answer..."
                  value={answers[index]}
                  onChange={(e) => {
                    const temp = [...answers];
                    temp[index] = e.target.value;
                    setAnswers(temp);
                  }}
                />

                <button
                  className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => handleEvaluate(index)}
                >
                  Check Answer
                </button>

                {feedback[index] && (
                  <div className="mt-4 p-3 bg-gray-100 rounded">
                    <strong>AI Feedback</strong>

                    <p className="mt-2">
                      {feedback[index]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Home;