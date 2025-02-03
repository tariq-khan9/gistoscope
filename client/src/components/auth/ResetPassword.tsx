import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { Modal } from "antd";

interface ResetPasswordFormInputs {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>();

  const newPassword = watch("newPassword");

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/reset/reset-password`,
        {
          token,
          newPassword: data.newPassword,
        }
      );
      Modal.success({
        title: "Password changed!",
        content: "Your password is changed successfully.",
        onOk() {
          navigate("/login");
        },
      });

      navigate("/login"); // Redirect to login after successful reset
    } catch (error) {
      Modal.error({
        title: "Something wrong!",
        content: "An error occurred, please try again later.",
        onOk() {},
      });
    }
  };

  return (
    <div className="w-full flex flex-row justify-center items-center pt-20 xl:pt-28">
      <div className="bg-gray-100 rounded-xl w-[700px] h-[400px] p-4 flex flex-col items-center">
        <h2 className="form-heading">Reset Password</h2>
        <form
          className="flex flex-col w-full px-40"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="form-label">New Password</label>
          <input
            className="form-input"
            type="password"
            {...register("newPassword", {
              required: "New Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />
          {errors.newPassword && (
            <p className="text-red-500">{errors.newPassword.message}</p>
          )}

          <label className="form-label">Confirm Password</label>
          <input
            className="form-input"
            type="password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}

          <button className="form-button" type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
