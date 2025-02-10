// auth/sendVerificationEmail.ts
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import prisma from "../../prisma/prismaClient.js";
import { Request, Response } from "express";

export const sendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  // Check if the user exists
  if (!email) return;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  // Generate a JWT verification token (expires in 24 hours)
  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: "24h",
  });

  // Email verification link
  const verifyUrl = `${process.env.CLIENT_URL}/login/${token}`;

  // Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
  });

  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER || "gistoscope99@gmail.com",
    subject: "Email Verification",
    text: `Welcome! Please verify your email by clicking the link: ${verifyUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: "Verification email sent. Please check your inbox." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send verification email." });
  }
};
