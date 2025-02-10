import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Modal } from "antd";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useGlobalContext();
  const { token } = useParams<{ token: string }>(); // ✅ Get token from URL param

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      Modal.error({
        title: "Authentication failed!",
        content:
          "Invalid email or password, please provide a verified email address and correct password.",
        onOk() {},
      });
    }
  };

  useEffect(() => {
    if (token) {
      try {
        verifyEmail(token);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, [token]);

  const verifyEmail = async (authToken: string) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/verify/verify-email`,
        { authToken },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status !== 200) {
        Modal.error({
          title: "Email Validation Failed",
          content: "Failed to validate your email. Please try again!",
          onOk() {
            console.log("User acknowledged the error message");
            navigate("/login");
          },
        });
      }
    } catch (error) {
      console.error("Error verifying email:", error);
    }
  };

  return (
    <div className="w-full font-barlow flex flex-row justify-center items-center mt-24">
      <div className="bg-gray-100 rounded-xl w-[700px] h-[400px] p-4 flex flex-col sm:flex-row justify-between space-y-10 sm:space-y-0">
        <div className="sm:w-1/2 w-full">
          <div className="flex flex-row justify-center sm:mt-6">
            <h2>Login with</h2>
          </div>

          <div className="flex flex-row justify-center mt-4 sm:pr-4">
            <button
              className="font-roboto w-40 h-40 sm:w-60 sm:h-60 text-[20px] sm:text-[30px] bg-orange-200  hover:bg-orange-300 rounded-full"
              onClick={googleLogin}
            >
              Google
            </button>
          </div>
        </div>

        <div className="relative flex items-center">
          <span className="border-t sm:border-l border-gray-700 w-full sm:h-full"></span>
          <div className="absolute text-[12px] sm:text-[18px] font-roboto top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-10 w-10 sm:h-16 sm:w-16 rounded-full bg-gray-100 border border-gray-800 flex justify-center items-center text-gray-600 font-semibold">
            OR
          </div>
        </div>

        <div className="sm:w-1/2 p-2 w-full">
          <form className="flex flex-col p-4" onSubmit={handleLocalLogin}>
            <label className="mb-2 text-[12px] text-gray-500">
              Don't have an account?{" "}
              <a
                className="text-gray-700 font-semibold italic hover:text-gray-500"
                href="/register"
              >
                Register here!
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
            <div className="flex justify-end mt-1 font-montserrat text-[10px] sm:text-[12px] xl:text-[13px]">
              <button
                className="hover:text-gray-500 text-gray-600 "
                onClick={() => navigate("/forgot-password")}
              >
                forgot password?
              </button>
            </div>

            <div className="w-full flex justify-center mt-6">
              <button
                className="bg-green-200 hover:bg-green-300 h-24 sm:h-40 w-24 sm:w-40 text-[14px] sm:text-[20px] rounded-full"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
