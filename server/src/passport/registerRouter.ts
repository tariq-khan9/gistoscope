import express from "express";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import prisma from "../../prisma/prismaClient.js"; // Make sure this is correctly imported to interact with your database

const registerRouter = express.Router();
const uploadDir = path.join(process.cwd(), "uploads/profile");

// Configure multer for storing images in 'uploads/profile'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// User registration route
registerRouter.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const imageUrl = req.file
      ? `${process.env.SERVER_URL}/uploads/profile/${req.file.filename}`
      : null;

    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    // Save user data along with image URL in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userType: "member",
        authType: "local",
        image: imageUrl,
      },
    });

    res.json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

export default registerRouter;
