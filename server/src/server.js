import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import topologiRoutes from "./routes/topologiRoutes.js";
import subDeviceRoutes from "./routes/subDeviceRoutes.js";
import oltProxyRoutes from "./routes/oltProxyRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/topologi", topologiRoutes)
app.use("/api/sub-device", subDeviceRoutes);
app.use("/api/proxy", oltProxyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
