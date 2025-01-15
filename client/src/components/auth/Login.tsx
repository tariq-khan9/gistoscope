// src/components/Login.tsx
import React, { useState } from "react";
import { useGlobalContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="w-full flex flex-row justify-center items-center mt-24">
      <div className="bg-gray-100 rounded-xl w-[700px] h-[400px] p-4 flex flex-row justify-between">
        <div className="w-1/2">
          <div className="flex flex-row justify-center mt-6">
            <h2>Login with</h2>
          </div>

          <div className="flex flex-row justify-center mt-4 pr-4">
            <button
              className="w-60 h-60 text-[30px] bg-orange-200  hover:bg-orange-300 rounded-full"
              onClick={googleLogin}
            >
              Google
            </button>
          </div>
        </div>

        <div className="relative flex items-center">
          {/* Divider Line */}
          <span className="border-l border-gray-700 h-full"></span>

          {/* Orange Circle Positioned Absolutely in Center */}
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-gray-100 border border-gray-800 flex justify-center items-center text-gray-600 font-semibold">
            OR
          </div>
        </div>

        <div className="w-1/2 p-2 ">
          <form className="flex flex-col p-4" onSubmit={handleLocalLogin}>
            <label className="mb-2 text-[12px] text-gray-500">
              dont have accout?{" "}
              <a
                className="text-gray-700 font-semibold italic hover:text-gray-500"
                href="/register"
              >
                register here!
              </a>
            </label>
            <label>Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="mt-4">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="w-full flex justify-center mt-8">
              <button
                className="bg-green-200 hover:bg-green-300 h-40 w-40 text-[20px] rounded-full"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
          {error && <p>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
