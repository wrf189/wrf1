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
    <div className="flex w-full h-full min-h-screen relative bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Sidebar */}
      <SidebarComponent isCollapsed={isSidebarCollapsed} />

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center absolute z-50 top-6 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-700 ease-in-out border-2 border-white/20 backdrop-blur-sm"
        style={{
          left: isSidebarCollapsed ? "32px" : "260px",
          transition: "left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          transform: 'translateZ(0)', // Force hardware acceleration
          willChange: 'left, transform',
        }}
      >
        <span className={`text-lg font-bold transition-transform duration-500 ease-in-out ${
          isSidebarCollapsed ? 'rotate-0' : 'rotate-180'
        }`}>
          →
        </span>
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 h-full min-h-screen transition-all duration-700 ease-in-out ${
          isSidebarCollapsed ? "ml-20" : "ml-72"
        }`}
        style={{
          transform: 'translateZ(0)', // Force hardware acceleration
          willChange: 'margin-left',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;