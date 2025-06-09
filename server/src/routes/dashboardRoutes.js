import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", authorizeRoles("admin"), getDashboardData);

export default router;