import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// get unique uplinks from device table
export const getUplinks = async (req, res) => {
  try {
    const uplinks = await prisma.device.findMany({
      distinct: ["uplink"],
      select: {
        uplink: true,
      },
    });

    res.status(200).json({
      message: "Berhasil mengambil data uplinks",
      uplinks,
    });
  } catch (error) {
    console.error("Error fetching uplinks:", error);
    res.status(500).json({ error: "Failed to fetch uplinks" });
  }
};

// GET uplink dengan OLT berdasarkan uplink query
export const getUplinkToOLT = async (req, res) => {
  const { uplink } = req.query;

  if (!uplink) {
    return res
      .status(400)
      .json({ message: "uplink is required in query parameter" });
  }

  try {
    // Cek apakah uplink ada di database
    const uplinkExists = await prisma.device.findFirst({
      where: { uplink },
      select: { uplink: true },
    });

    if (!uplinkExists) {
      return res.status(404).json({ message: "Uplink tidak ditemukan" });
    }

    // Ambil semua device yang menggunakan uplink tersebut, dengan field backup yang lengkap
    const devices = await prisma.device.findMany({
      where: { uplink },
      select: {
        id: true,
        devicename: true,
        portdevicename: true,
        location: true,
        hostname: true,
        uplink: true,
        portuplink: true,
        backuplink: true,
        portdevicename_backup: true,
        portuplink_backup: true,
        backupToDeviceId: true,
        backupToDevice: {
          select: {
            id: true,
            devicename: true,
            hostname: true,
            uplink: true,
          },
        },
        subDevices: {
          select: {
            id: true,
            subdevicename: true,
            hostname: true,
            portsubdevice: true,
            portdevice: true,
            createdAt: true,
          },
        },
        status: true,
        createdAt: true,
      },
    });

    // Transform data supaya sesuai format backupType dan backupTarget
    const devicesWithBackupInfo = devices.map((device) => {
      let backupType = "no";
      let backupTarget = null;

      if (device.backuplink === "YES") {
        if (device.backupToDeviceId && device.backupToDevice) {
          // Backup ke device lain
          backupType = "device";
          backupTarget = {
            id: device.backupToDevice.id,
            devicename: device.backupToDevice.devicename,
            hostname: device.backupToDevice.hostname,
            uplink: device.backupToDevice.uplink,
            portTarget_backup: device.portuplink_backup,
          };
        } else {
          // Backup ke uplink langsung
          backupType = "uplink";
          backupTarget = device.uplink;
        }
      }

      // Buang backupToDevice supaya tidak muncul di response
      const { backupToDevice, ...deviceWithoutBackupToDevice } = device;

      return {
        ...deviceWithoutBackupToDevice,
        backupType,
        backupTarget,
      };
    });

    res.status(200).json({
      message: "Berhasil mengambil data uplink dengan olt",
      uplink: uplinkExists.uplink,
      devices: devicesWithBackupInfo,
    });
  } catch (error) {
    console.error("Error fetching uplink to OLT:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data" });
  }
};
