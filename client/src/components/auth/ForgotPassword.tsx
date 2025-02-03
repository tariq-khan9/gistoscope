import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

interface ForgotPasswordFormInputs {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

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

      reset();
      Modal.success({
        title: "Email sent!",
        content: "A password changing link has been sent to your email.",
        onOk() {
          navigate("/login");
        },
      });
    } catch (error) {
      Modal.error({
        title: "Something worng!",
        content: "An error occurred, please try again later.",
        onOk() {},
      });
    }
  };

  return (
    <div className="w-full flex flex-row justify-center pt-20 xl:pt-28">
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
      </div>
    </div>
  );
};

export default ForgotPassword;
