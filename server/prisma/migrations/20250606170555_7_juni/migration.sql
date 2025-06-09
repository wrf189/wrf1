-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "devicename" TEXT NOT NULL,
    "portdevicename" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "uplink" TEXT NOT NULL,
    "portuplink" TEXT NOT NULL,
    "backuplink" TEXT NOT NULL,
    "portdevicename_backup" TEXT,
    "portuplink_backup" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sub_Device" (
    "id" TEXT NOT NULL,
    "subdevicename" TEXT NOT NULL,
    "portsubdevice" TEXT NOT NULL,
    "portdevice" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceId" TEXT NOT NULL,

    CONSTRAINT "Sub_Device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Sub_Device" ADD CONSTRAINT "Sub_Device_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
