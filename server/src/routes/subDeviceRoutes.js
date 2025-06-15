import express from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import {
  createSubDevice,
  deleteSubDevice,
  getAllSubDevices,
  getSubDevicesByDeviceId,
  updateSubDevice,
} from "../controllers/subDeviceController.js";

const router = express.Router();
router.use(authenticateToken);

router.post("/", authorizeRoles("admin"), createSubDevice);
router.get("/", authorizeRoles("admin"), getAllSubDevices);
router.get(
  "/by-device/:deviceId",
  authorizeRoles("admin"),
  getSubDevicesByDeviceId
);
router.put("/:id", authorizeRoles("admin"), updateSubDevice);
router.delete("/:id", authorizeRoles("admin"), deleteSubDevice);

export default router;
