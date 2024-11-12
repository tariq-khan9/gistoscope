// auth/forgotPassword.ts

import crypto from "crypto";
import prisma from "../../prisma/prismaClient.js";
import nodemailer from "nodemailer";
import { Request, Response } from "express";

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  // Check if the user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  // Generate a token and set expiration
  const token = crypto.randomBytes(20).toString("hex");
  const expires = new Date(Date.now() + 3600000); // 1-hour expiration

  // Update the user with the reset token and expiration
  await prisma.user.update({
    where: { email },
    data: {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    },
  });

  // Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const mailOptions = {
    to: email,
    from: process.env.EMAIL_FROM || "your-email@example.com",
    subject: "Password Reset",
    text: `You are receiving this email because you requested a password reset. Please click the following link to reset your password: ${resetUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send reset email" });
  }
};
