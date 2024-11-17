import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

interface ForgotPasswordFormInputs {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormInputs>();

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/reset/forgot-password`,
        { email: data.email }
      );
      setMessage(response.data.message);
      reset();

      // Clear message after 7 seconds
      setTimeout(() => {
        setMessage("");
      }, 7000);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setTimeout(() => {
        setMessage("");
      }, 7000);
    }
  };

  return (
    <div className="w-full flex flex-row justify-center">
      <div className="bg-gray-100 rounded-xl w-[700px] h-[400px] p-4 flex flex-col items-center">
        <h2 className="form-heading">Forgot Password</h2>
        <form className="w-full px-40" onSubmit={handleSubmit(onSubmit)}>
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-[12px] mt-1">
              {errors.email.message}
            </p>
          )}

          <button className="form-button" type="submit">
            Submit
          </button>
        </form>
        {message && (
          <p
            className={`text-[14px] ${
              message.includes("error") ? "text-red-500" : "text-green-600"
            } mt-20`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
