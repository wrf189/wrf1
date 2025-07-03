import express from "express";
import {
  createDevice,
  deleteDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
} from "../controllers/deviceController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", authorizeRoles("admin","user"), getAllDevices);
router.get("/:id", authorizeRoles("admin"), getDeviceById);
router.post("/", authorizeRoles("admin"), createDevice);
router.put("/:id", authorizeRoles("admin"), updateDevice);
router.delete("/:id", authorizeRoles("admin"), deleteDevice);

export default router;