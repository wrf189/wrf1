import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ambil semua device
export const getAllDevices = async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
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
        status: true,
        createdAt: true,
      },
    });

    const devicesWithBackupInfo = devices.map((device) => {
      let backupType = "no";
      let backupTarget = null;

      if (device.backuplink === "YES") {
        if (device.backupToDeviceId) {
          // Backup ke device lain
          backupType = "device";
          backupTarget = {
            id: device.backupToDevice.id,
            devicename: device.backupToDevice.devicename,
            hostname: device.backupToDevice.hostname,
            uplink: device.backupToDevice.uplink,
            portTarget_backup: device.portuplink_backup, // port target backup di device tujuan
          };
        } else {
          // Backup ke uplink
          backupType = "uplink";
          backupTarget = device.uplink;
          // Kalau mau portuplink_backup juga ditampilkan di root (tetap biar gak hilang)
          // atau bisa juga diubah sesuai kebutuhan
        }
      }

      // Buang backupToDevice supaya gak muncul di response
      const { backupToDevice, ...deviceWithoutBackupToDevice } = device;

      return {
        ...deviceWithoutBackupToDevice,
        backupType,
        backupTarget,
      };
    });

    res.status(200).json({
      message: "Berhasil mengambil semua device",
      devices: devicesWithBackupInfo,
    });
  } catch (error) {
    console.error("Error saat mengambil semua device:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

// Ambil device berdasarkan ID
export const getDeviceById = async (req, res) => {
  try {
    const id = req.params.id;
    const device = await prisma.device.findUnique({
      where: { id: id },
      select: {
        id: true,
        devicename: true,
        portdevicename: true,
        location: true,
        hostname: true,
        uplink: true,
        portuplink: true,
        backuplink: true,
        status: true,
        createdAt: true,
      },
    });

    if (!device) {
      return res.status(404).json({ message: "Device tidak ditemukan" });
    }

    res.status(200).json({ message: "Berhasil mengambil device", device });
  } catch (error) {
    console.error("Error saat mengambil device:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

// Tambah device baru
export const createDevice = async (req, res) => {
  try {
    const {
      devicename,
      portdevicename,
      location,
      hostname,
      uplink,
      portuplink,
      backuplink,
      status,
      portdevicename_backup,
      portuplink_backup,
      backupToDevice, // bisa string uplink atau devicename device lain, optional
      backupType, // "uplink" atau "device" (opsional, untuk penjelasan tujuan backup)
    } = req.body;

    // Validasi required fields
    if (
      !devicename ||
      !portdevicename ||
      !location ||
      !hostname ||
      !uplink ||
      !portuplink ||
      !status ||
      !backuplink
    ) {
      return res.status(400).json({ message: "Field wajib diisi semua" });
    }

    // Ambil semua device dengan uplink yang sama
    const existingDevices = await prisma.device.findMany({
      where: { uplink },
    });

    // Cek portuplink dan portuplink_backup bentrok di uplink yang sama
    const portConflict = existingDevices.find((device) => {
      return (
        device.portuplink === portuplink ||
        (backuplink === "YES" && device.portuplink === portuplink_backup) ||
        (backuplink === "YES" && device.portuplink_backup === portuplink) ||
        (backuplink === "YES" && device.portuplink_backup === portuplink_backup)
      );
    });

    if (portConflict) {
      return res.status(400).json({
        message: `portuplink atau portuplink_backup sudah digunakan dalam uplink ${uplink}`,
      });
    }

    let backupToDeviceId = null;

    if (backuplink === "YES") {
      if (backupType === "device") {
        if (!backupToDevice) {
          return res.status(400).json({
            message: "backupToDevice harus diisi jika backupType 'device'",
          });
        }

        // Cari device tujuan backup berdasarkan devicename
        const backupDevice = await prisma.device.findFirst({
          where: { devicename: backupToDevice },
        });

        if (!backupDevice) {
          return res.status(404).json({
            message: `Device backup dengan devicename '${backupToDevice}' tidak ditemukan`,
          });
        }

        backupToDeviceId = backupDevice.id;

        // Cek portuplink_backup di device tujuan backup sudah dipakai atau belum
        const backupDevicesPorts = await prisma.device.findMany({
          where: { id: backupToDeviceId },
        });

        // Biasanya cuma 1 device, tapi pakai findMany untuk konsisten
        if (backupDevicesPorts.length > 0) {
          const dev = backupDevicesPorts[0];
          if (
            dev.portuplink === portuplink_backup ||
            dev.portuplink_backup === portuplink_backup
          ) {
            return res.status(400).json({
              message: `portuplink_backup ${portuplink_backup} sudah digunakan di device backup '${backupToDevice}'`,
            });
          }
        }
      } else if (backupType === "uplink") {
        // backup ke uplink, cek portuplink_backup sudah dipakai di uplink tujuan atau belum
        const backupDevicesOnUplink = await prisma.device.findMany({
          where: { uplink: backupToDevice }, // backupToDevice = uplink name string
        });

        const conflictBackupPort = backupDevicesOnUplink.find((device) => {
          return (
            device.portuplink === portuplink_backup ||
            device.portuplink_backup === portuplink_backup
          );
        });

        if (conflictBackupPort) {
          return res.status(400).json({
            message: `portuplink_backup ${portuplink_backup} sudah digunakan pada uplink backup '${backupToDevice}'`,
          });
        }
      } else {
        return res.status(400).json({
          message:
            "backupType harus 'uplink' atau 'device' jika backuplink 'YES'",
        });
      }
    }

    // Build data device baru
    const deviceData = {
      devicename,
      portdevicename,
      location,
      hostname,
      uplink,
      portuplink,
      backuplink,
      status,
      ...(backuplink === "YES" && {
        portdevicename_backup,
        portuplink_backup,
        ...(backupToDeviceId && { backupToDeviceId }),
      }),
    };

    const device = await prisma.device.create({
      data: deviceData,
    });

    res.status(201).json({ message: "Device berhasil ditambahkan", device });
  } catch (error) {
    console.error("Error saat menambahkan device:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

// Update device berdasarkan ID
export const updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      devicename,
      portdevicename,
      location,
      hostname,
      uplink,
      portuplink,
      backuplink,
      status,
      portdevicename_backup,
      portuplink_backup,
      backupToDevice,
      backupType,
    } = req.body;

    // Cek apakah device ada
    const existingDevice = await prisma.device.findUnique({
      where: { id: id },
    });

    if (!existingDevice) {
      return res.status(404).json({ message: "Device tidak ditemukan" });
    }

    // Validasi required fields
    if (
      !devicename ||
      !portdevicename ||
      !location ||
      !hostname ||
      !uplink ||
      !portuplink ||
      !status ||
      !backuplink
    ) {
      return res.status(400).json({ message: "Field wajib diisi semua" });
    }

    // Jika uplink berubah atau portuplink berubah, cek konflik port
    if (
      uplink !== existingDevice.uplink ||
      portuplink !== existingDevice.portuplink
    ) {
      const existingDevices = await prisma.device.findMany({
        where: {
          uplink,
          id: { not: id }, // exclude device yang sedang diupdate
        },
      });

      const portConflict = existingDevices.find((device) => {
        return (
          device.portuplink === portuplink ||
          (backuplink === "YES" && device.portuplink === portuplink_backup) ||
          (backuplink === "YES" && device.portuplink_backup === portuplink) ||
          (backuplink === "YES" &&
            device.portuplink_backup === portuplink_backup)
        );
      });

      if (portConflict) {
        return res.status(400).json({
          message: `portuplink atau portuplink_backup sudah digunakan dalam uplink ${uplink}`,
        });
      }
    }

    let backupToDeviceId = null;

    if (backuplink === "YES") {
      if (backupType === "device") {
        if (!backupToDevice) {
          return res.status(400).json({
            message: "backupToDevice harus diisi jika backupType 'device'",
          });
        }

        // Cari device tujuan backup berdasarkan devicename
        const backupDevice = await prisma.device.findFirst({
          where: { devicename: backupToDevice },
        });

        if (!backupDevice) {
          return res.status(404).json({
            message: `Device backup dengan devicename '${backupToDevice}' tidak ditemukan`,
          });
        }

        backupToDeviceId = backupDevice.id;

        // Cek portuplink_backup di device tujuan backup sudah dipakai atau belum
        // Exclude device yang sedang diupdate dari pengecekan
        const backupDevicesPorts = await prisma.device.findMany({
          where: {
            id: backupToDeviceId,
            id: { not: id }, // exclude device yang sedang diupdate
          },
        });

        if (backupDevicesPorts.length > 0) {
          const dev = backupDevicesPorts[0];
          if (
            dev.portuplink === portuplink_backup ||
            dev.portuplink_backup === portuplink_backup
          ) {
            return res.status(400).json({
              message: `portuplink_backup ${portuplink_backup} sudah digunakan di device backup '${backupToDevice}'`,
            });
          }
        }
      } else if (backupType === "uplink") {
        // backup ke uplink, cek portuplink_backup sudah dipakai di uplink tujuan atau belum
        const backupDevicesOnUplink = await prisma.device.findMany({
          where: {
            uplink: backupToDevice,
            id: { not: id }, // exclude device yang sedang diupdate
          },
        });

        const conflictBackupPort = backupDevicesOnUplink.find((device) => {
          return (
            device.portuplink === portuplink_backup ||
            device.portuplink_backup === portuplink_backup
          );
        });

        if (conflictBackupPort) {
          return res.status(400).json({
            message: `portuplink_backup ${portuplink_backup} sudah digunakan pada uplink backup '${backupToDevice}'`,
          });
        }
      } else {
        return res.status(400).json({
          message:
            "backupType harus 'uplink' atau 'device' jika backuplink 'YES'",
        });
      }
    }

    // Build data device untuk update
    const deviceData = {
      devicename,
      portdevicename,
      location,
      hostname,
      uplink,
      portuplink,
      backuplink,
      status,
      // Reset backup fields jika backuplink bukan "YES"
      portdevicename_backup:
        backuplink === "YES" ? portdevicename_backup : null,
      portuplink_backup: backuplink === "YES" ? portuplink_backup : null,
      backupToDeviceId:
        backuplink === "YES" && backupToDeviceId ? backupToDeviceId : null,
    };

    const updatedDevice = await prisma.device.update({
      where: { id: id },
      data: deviceData,
    });

    res.status(200).json({
      message: "Device berhasil diupdate",
      device: updatedDevice,
    });
  } catch (error) {
    console.error("Error saat mengupdate device:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};``
prisma.device.findMany({
  select: {
    id: true,
    devicename: true,
    location: true,
    hostname: true,
    uplink: true,
    backuplink: true,
    status: true,
    createdAt: true,
  },
});

// Delete device
export const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;

    const device = await prisma.device.findUnique({ where: { id: id } });
    if (!device) {
      return res.status(404).json({ message: "Device tidak ditemukan" });
    }

    await prisma.device.delete({ where: { id: id } });

    res.status(200).json({ message: "Device berhasil dihapus" });
  } catch (error) {
    console.error("Error saat menghapus device:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
