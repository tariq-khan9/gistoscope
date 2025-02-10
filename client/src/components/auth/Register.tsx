// Register.tsx
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal } from "antd";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  image?: File;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (imageFile) formData.append("image", imageFile);
    console.log("form data at top ", formData);
    try {
      const register = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const verify = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/verify/send-verification-email`,
        { email: data.email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      Modal.success({
        title: "Email sent!",
        content:
          "A verification email has been sent. Please click the verification link within 24 hours to complete registration",
        onOk() {
          navigate("/login");
        },
      });
      // console.log(response.data);
    } catch (error) {
      console.error("Error registering user:", error);
      const deleteUser = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/verify/delete-user`,
        { email: data.email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("user deleted ", deleteUser);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-24  flex justify-center">
      <form
        className="bg-slate-200 px-4 sm:px-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-center">
          <label className="form-heading ">Register here.</label>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-10 w-full">
          <div>
            <div>
              <label className="form-label">Name</label>
              <input
                className="form-input"
                {...register("name", { required: "Name is required" })}
              />
              <div className="h-4">
                {errors.name && (
                  <span className="error-msg">{errors.name.message}</span>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Invalid email format",
                  },
                })}
              />
              <div className="h-4">
                {errors.email && (
                  <span className="error-msg">{errors.email.message}</span>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <div className="h-4">
                {errors.password && (
                  <span className="error-msg">{errors.password.message}</span>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">Confirm Password</label>
              <input
                className="form-input"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
              <div className="h-4">
                {errors.confirmPassword && (
                  <span className="error-msg">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="mt-6">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  height={120}
                  width={120}
                />
              ) : (
                <div className="h-32 w-32 text-slate-400  bg-slate-50 flex justify-center items-center">
                  Profile Image
                </div>
              )}
              <label className="form-label">Profile Image (optional)</label>
              <div className="flex flex-col">
                <input
                  type="file"
                  accept="image/*"
                  className="text-[12px] mt-2"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>
        </div>

        <button className="form-button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
