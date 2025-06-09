import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import SidebarComponent from "../components/SidebarComponent";

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const collapsedFromStorage = localStorage.getItem("isSidebarCollapsed");
    if (collapsedFromStorage !== null) {
      setIsSidebarCollapsed(collapsedFromStorage === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("isSidebarCollapsed", newState);
      return newState;
    });
  };

  return (
    <div className="flex w-full h-full min-h-screen relative">
      {/* Sidebar */}
      <SidebarComponent isCollapsed={isSidebarCollapsed} />

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center absolute z-50 top-15 left-55 transition-all duration-300 border-2 border-purple-600 hover:bg-white hover:text-purple-600"
        style={{
          transform: isSidebarCollapsed
            ? "translateX(-160px)"
            : "translateX(0)",
          transition: "transform 0.3s",
        }}
      >
        {isSidebarCollapsed ? ">" : "<"}
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 h-full ${
          isSidebarCollapsed ? "ml-20" : "ml-60"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
