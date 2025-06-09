import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware untuk mengecek apakah user sudah login
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Format header: "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // pastikan JWT_SECRET ada di .env
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: "User tidak valid" });
    }

    req.user = user; // simpan user di request untuk digunakan di route
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token tidak valid", error: error.message });
  }
};

// Middleware untuk mengecek apakah user punya role tertentu (contoh: admin)
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak: role tidak diizinkan" });
    }
    next();
  };
};
