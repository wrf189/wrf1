import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    // Validasi field harus diisi
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Validasi password minimal 8 karakter, ada huruf besar, huruf kecil, angka, dan simbol
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain uppercase letters, lowercase letters, numbers, and symbols",
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash password dan buat user baru
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi field harus diisi
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required"});
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Cek kecocokan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Verify Token
export const verifyToken = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Token is valid",
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        exp: decoded.exp
      }
    });

  } catch (error) {
    console.error("Error during token verification:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    res.status(401).json({ message: "Invalid token" });
  }
};