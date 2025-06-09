import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from "../controllers/userController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", authorizeRoles("admin"), getAllUsers);
router.post("/", authorizeRoles("admin"), createUser);
router.get("/:id", authorizeRoles("admin"), getUserById);
router.put("/:id", authorizeRoles("admin"), updateUser);
router.delete("/:id", authorizeRoles("admin"), deleteUser);

export default router;
