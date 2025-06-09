import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ambil semua user
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({ message: "Berhasil mengambil semua user", users });
  } catch (error) {
    console.error("Error saat mengambil semua user:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

// Ambil user berdasarkan ID
export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({ message: "Berhasil mengambil user", user });
  } catch (error) {
    console.error("Error saat mengambil user:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

// Tambah user baru
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    const user = await prisma.user.create({
      data: { name, email, password, role },
    });

    res.status(201).json({ message: "User berhasil ditambahkan", user });
  } catch (error) {
    console.error("Error saat menambahkan user:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

// Update user berdasarkan ID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { name, email, password, role },
    });

    res.status(200).json({
      message: "User berhasil diupdate",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error saat mengupdate user:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

// Hapus user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    await prisma.user.delete({ where: { id: id } });

    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("Error saat menghapus user:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
