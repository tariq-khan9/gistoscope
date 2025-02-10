// auth/verifyEmail.ts
import dotenv from "dotenv";
dotenv.config();
import prisma from "../../prisma/prismaClient.js";
export const deleteUser = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user)
            return;
        const user2 = await prisma.user.delete({
            where: { email: email },
        });
        res.status(200).json({ message: "Email deleted successfully!" });
    }
    catch (error) {
        console.error("deletion error:", error);
        res.status(400).json({ message: "deletion error" });
    }
};
