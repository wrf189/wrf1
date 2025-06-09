import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /sub-device
export const createSubDevice = async (req, res) => {
  try {
    const { subdevicename, hostname, portsubdevice, deviceId, portdevice } = req.body;

    // Validasi input
    if (!subdevicename || !hostname || !portsubdevice || !deviceId || !portdevice) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Cek apakah deviceId valid
    const existingDevice = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!existingDevice) {
      return res.status(404).json({ message: `Device dengan ID '${deviceId}' tidak ditemukan` });
    }

    // VALIDASI #1: Cek kombinasi deviceId + portdevice
    const duplicatePortDevice = await prisma.sub_Device.findFirst({
      where: {
        deviceId,
        portdevice,
      },
    });

    if (duplicatePortDevice) {
      return res.status(409).json({
        message: `Port device ${portdevice} pada device ini sudah digunakan.`,
      });
    }

    // VALIDASI #2: Cek subdevicename + portsubdevice
    const duplicateSubPort = await prisma.sub_Device.findFirst({
      where: {
        subdevicename,
        portsubdevice,
      },
    });

    if (duplicateSubPort) {
      return res.status(409).json({
        message: `Port sub device ${portsubdevice} sudah digunakan untuk sub device '${subdevicename}'.`,
      });
    }

    // Simpan ke database
    const newSubDevice = await prisma.sub_Device.create({
      data: {
        subdevicename,
        hostname,
        portsubdevice,
        deviceId,
        portdevice,
      },
    });

    res.status(201).json({
      message: "Sub device berhasil dibuat",
      data: newSubDevice,
    });
  } catch (error) {
    console.error("Create SubDevice Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// GET /sub-device
export const getAllSubDevices = async (req, res) => {
  try {
    const subDevices = await prisma.sub_Device.findMany({
      include: {
        device: true, // include parent device if needed
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ data: subDevices });
  } catch (error) {
    console.error("Get All SubDevices Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /sub-device/by-device/:deviceId
export const getSubDevicesByDeviceId = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const subDevices = await prisma.sub_Device.findMany({
      where: { deviceId },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ data: subDevices });
  } catch (error) {
    console.error("Get SubDevices By Device ID Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /sub-device/:id
export const deleteSubDevice = async (req, res) => {
  try {
    const { id } = req.params;

    const subDevice = await prisma.sub_Device.findUnique({ where: { id: id } });
    if (!subDevice) {
      return res.status(404).json({ message: "Sub device tidak ditemukan" });
    }

    await prisma.sub_Device.delete({ where: { id: id } });

    res.status(200).json({ message: "Sub device berhasil dihapus" });
  } catch (error) {
    console.error("Error saat menghapus sub device:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
