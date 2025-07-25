"use client";
import { useState, ChangeEvent } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      navigate("/admin");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#eb2184]/20 via-white to-pink-100 p-4 sm:p-6">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 drop-shadow-md animate-slide-in">
        Matson Admin Login
      </h2>
      <div className="bg-white/80 p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg transform transition-all duration-500 hover:shadow-xl animate-fade-in backdrop-blur-md border border-gray-200/50">
        {error && (
          <div className="text-red-500 mb-4 text-center text-base sm:text-lg animate-pulse">
            {error}
          </div>
        )}
        <div className="space-y-5">
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#eb2184] transition-all duration-300">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mx-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l9-6 9 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="p-2 w-full rounded-lg border-none focus:outline-none text-sm sm:text-base bg-transparent"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#eb2184] transition-all duration-300">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mx-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m4-4c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m6-4c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4M5 15v4a2 2 0 002 2h10a2 2 0 002-2v-4"
                />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="p-2 w-full rounded-lg border-none focus:outline-none text-sm sm:text-base bg-transparent"
              />
            </div>
          </div>
          <button
            onClick={handleLogin}
            className="bg-[#eb2184] text-white p-2 sm:px-4 sm:py-3 rounded-lg hover:bg-[#c81c71] transition-all duration-300 w-full flex items-center justify-center transform hover:scale-105"
            title="Login"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14"
              />
            </svg>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
