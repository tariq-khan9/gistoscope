// auth/verifyEmail.ts
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient.js";
export const verifyEmail = async (req, res) => {
    const { authToken } = req.body;
    try {
        // Verify JWT token
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        // Find user and update isEmailVerified to true
        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
        });
        if (!user) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }
        await prisma.user.update({
            where: { email: decoded.email },
            data: { isEmailVerified: true },
        });
        res.status(200).json({ message: "Email verified successfully!" });
    }
    catch (error) {
        res.status(400).json({ message: "Invalid or expired verification link" });
    }
};
