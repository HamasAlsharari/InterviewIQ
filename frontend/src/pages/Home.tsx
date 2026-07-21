import Navbar from "../components/Navbar";
import api from "../services/api";

function Home() {
  const handleClick = async () => {
    try {
      const response = await api.get("/api/health");
      alert(`${response.data.status}: ${response.data.message}`);
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the backend.");
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
          Practice technical interviews with AI and receive instant feedback.
        </p>

        <button
          className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg"
          onClick={handleClick}
        >
          Start Interview
        </button>
      </section>
    </>
  );
}

export default Home;