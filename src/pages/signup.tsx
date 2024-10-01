import { React, useState } from "react";
import { Link } from "react-router-dom"
import { toast } from "react-toastify";
import axios from "axios";

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const signInWithGoogle = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!fullName || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/signup", {
        fullName,
        email,
        password,
      });
      toast.success("Sign up successful!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Unexpected error";
      toast.error(`Sign up failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-green-100 flex justify-center p-4">
        <div className="max-w-4xl w-full flex justify-center items-center flex-col">
          <div className="card shadow-sm rounded-lg p-2 bg-white w-full mb-6 text-lg">
            OhTopUp Resume Review
          </div>
          <div className="flex flex-col md:flex-row justify-between w-full">
            <div className="flex flex-col gap-1">
              <p className="text-2xl text-gray-600 text-semibold">
                Need some help with your career?
              </p>
              <p className="text-2xl text-green-600 font-semibold">
                <span className="text-[#000] font-bold">Career AI</span> is{" "}
                <br /> Your Best Friend
              </p>

              <div className="mt-6 bg-white rounded-lg shadow-md text-[14px]">
                <h2 className="text-xl font-bold border-b-2 border-gray-200 pb-2 mb-4">
                  <p className="px-4 py-2 text-[14px]">Our Services</p>
                </h2>
                <h3 className="px-4 text-[14px] font-semibold">
                  Some of our services you'll need:
                </h3>
                <p className="list-disc pl-5 mt-2 px-4 flex flex-col gap-1 pb-3">
                  <span>Interviews Prep</span>
                  <span>LinkedIn Profile Review</span>
                  <span>CV/Resume Builder</span>
                  <span>Career Advisor Chat</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 md:my-0 my-8">
              <h1 className="text-2xl font-bold">Sign Up</h1>

              <div className="mt-4">
                <button
                  onClick={signInWithGoogle}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
                >
                  Sign Up with Google
                </button>
              </div>

              <div className="mt-4 text-gray-600 font-bold">Or Sign Up with Email</div>

              <form
                className="mt-4 flex flex-col gap-4"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Oge Obubu"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 p-2 border border-[1px] border-solid"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@yourmail.com"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 p-2 border border-[1px] border-solid"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="********"
                    className="mt-1 block w-full border-gray-300 rounded-md border border-[1px] border-solid shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 p-2"
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="********"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 p-2 border border-[1px] border-solid"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`mt-6 w-[45%] bg-green-600 text-white py-2 rounded-md hover:bg-green-700 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>
              </form>

              <p className="mt-4 text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/signin" className="text-green-600 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
