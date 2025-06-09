import express from "express";
import {
  getUplinks,
  getUplinkToOLT,
} from "../controllers/topologiController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/uplinks", authorizeRoles("admin", "user"), getUplinks);
router.get("/uplink-to-olt", authorizeRoles("admin", "user"), getUplinkToOLT);

export default router;
