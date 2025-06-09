import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardData = async (req, res) => {
  try {
    // Hitung user berdasarkan role
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    const userCount = await prisma.user.count({ where: { role: "user" } });

    // Hitung OLT yang online
    const oltCount = await prisma.device.count();

    // Hitung total perangkat
    const totalPerangkat = await prisma.device.findMany({
      distinct: ["uplink"],
      select: { uplink: true },
    });

    // Hitung lokasi unik (Kabupaten/Kota)
    const uniqueLocations = await prisma.device.findMany({
      distinct: ["location"],
      select: { location: true },
    });

    res.status(200).json({
      message: "Berhasil mengambil data dashboard",
      users: [
        { title: "admin", quantity: adminCount },
        { title: "user", quantity: userCount },
      ],
      devices: [
        { title: "Total Perangkat", quantity: (oltCount + totalPerangkat.length) },
        { title: "Kabupaten/Kota", quantity: uniqueLocations.length },
        { title: "OLT", quantity: oltCount },
      ],
    });
  } catch (error) {
    console.error("Error mengambil data dashboard:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
