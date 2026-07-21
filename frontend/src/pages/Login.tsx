import Navbar from "../components/Navbar";

function Login() {
  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center mt-20">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

          <h1 className="text-3xl font-bold text-center mb-8">
            Login
          </h1>

          <form className="space-y-5">

            <div>
              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-lg p-3"
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
              />
            </div>

            <button
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