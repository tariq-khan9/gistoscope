// auth/resetPassword.ts

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../../prisma/prismaClient.js";

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token, newPassword } = req.body;

  // Find user by reset token and check if the token has expired
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { gt: new Date() }, // Ensure token is still valid
    },
  });

  if (!user) {
    res
      .status(400)
      .json({ message: "Password reset token is invalid or has expired" });
    return;
  }

  // Hash the new password and update the user record
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  res.status(200).json({ message: "Password has been reset successfully" });
};
