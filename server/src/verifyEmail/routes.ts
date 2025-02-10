// auth/index.ts

import express from "express";

import { sendVerificationEmail } from "../verifyEmail/sendVerificationEmail.js";
import { verifyEmail } from "../verifyEmail/verifyEmail.js";
import { deleteUser } from "./deleteUser.js";

const verifyRouter = express.Router();

verifyRouter.post("/send-verification-email", sendVerificationEmail);
verifyRouter.post("/verify-email", verifyEmail);
verifyRouter.post("/delete-user", deleteUser);

export default verifyRouter;
