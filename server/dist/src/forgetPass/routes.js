// auth/index.ts
import express from "express";
import { forgotPassword } from "./forgetPassword.js";
import { resetPassword } from "./resetPassword.js";
const resetRouter = express.Router();
resetRouter.post("/forgot-password", forgotPassword);
resetRouter.post("/reset-password", resetPassword);
export default resetRouter;
