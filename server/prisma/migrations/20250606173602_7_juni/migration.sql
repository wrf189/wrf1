-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "backupToDeviceId" TEXT;

-- AlterTable
ALTER TABLE "Sub_Device" ADD COLUMN     "hostname" TEXT;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_backupToDeviceId_fkey" FOREIGN KEY ("backupToDeviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;
