import React from "react";
import { Route, Routes, Navigate } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLahyout from "./layouts/DashboardLahyout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./middlewares/PrivateRoute";
import UsersPage from "./pages/UsersPage";
import useVerifyOnRouteChange from "./middlewares/useVerifyOnRouteChange";
import DevicesPage from "./pages/DevicesPage";
import TopologiPage from "./pages/TopologiPage";
import MonitoringPage from "./pages/MonitoringPage";
import DeviceDetailPage from "./pages/DeviceDetailPage";
import { Toaster } from "react-hot-toast";

const App = () => {
  useVerifyOnRouteChange();

  return (
    <div>
      <Toaster position="top-right" />
      <Routes>
        {/* redirect root to login */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* auth route */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* dashboard route */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLahyout />}>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="devices" element={<DevicesPage />} />
            <Route path="device/:id" element={<DeviceDetailPage />} />
            <Route path="topologi" element={<TopologiPage />} />
            <Route path="monitoring" element={<MonitoringPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
