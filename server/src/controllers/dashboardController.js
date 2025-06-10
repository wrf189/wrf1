import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardData = async (req, res) => {
  try {
    const userRole = req.user.role; // Ambil role dari token yang sudah diverifikasi

    // Data perangkat (semua role bisa melihat)
    const oltCount = await prisma.device.count();
    const totalPerangkat = await prisma.device.findMany({
      distinct: ["uplink"],
      select: { uplink: true },
    });
    const uniqueLocations = await prisma.device.findMany({
      distinct: ["location"],
      select: { location: true },
    });

    const devicesData = [
      { title: "Total Perangkat", quantity: (oltCount + totalPerangkat.length) },
      { title: "Kabupaten/Kota", quantity: uniqueLocations.length },
      { title: "OLT", quantity: oltCount },
    ];

    // Jika user adalah admin, kirim semua data termasuk informasi user
    if (userRole === "admin") {
      const adminCount = await prisma.user.count({ where: { role: "admin" } });
      const userCount = await prisma.user.count({ where: { role: "user" } });

      res.status(200).json({
        message: "Berhasil mengambil data dashboard",
        users: [
          { title: "admin", quantity: adminCount },
          { title: "user", quantity: userCount },
        ],
        devices: devicesData,
        userRole: userRole
      });
    } else {
      // Jika user biasa, hanya kirim data perangkat
      res.status(200).json({
        message: "Berhasil mengambil data dashboard",
        devices: devicesData,
        userRole: userRole
      });
    }
  } catch (error) {
    console.error("Error mengambil data dashboard:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};