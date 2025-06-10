import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { RiArrowDownSLine, RiDashboardFill, RiUserFill, RiBaseStationFill, RiComputerFill, RiGitForkFill } from "react-icons/ri";
import Cookies from "js-cookie";

const menuSidebar = [
  { name: "Dashboard", path: "/dashboard", icon: <RiDashboardFill /> },
  { name: "Users", path: "/dashboard/users", icon: <RiUserFill /> },
  { name: "Devices", path: "/dashboard/devices", icon: <RiBaseStationFill /> },
  { name: "Topology", path: "/dashboard/topologi", icon: <RiGitForkFill /> },
  { name: "Monitoring", path: "/dashboard/monitoring", icon: <RiComputerFill /> },
];

const SidebarComponent = ({ isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const claim = localStorage.getItem("claim");
    if (claim) {
      try {
        const parsedClaim = JSON.parse(claim);
        setUserInfo({
          name: parsedClaim.name || "Guest",
          role: parsedClaim.role || "Unknown",
        });
      } catch (error) {
        console.error("Failed to parse claim:", error);
        setUserInfo({ name: "Guest", role: "Unknown" });
      }
    }
  }, []);

  const filteredMenu =
    userInfo.role === "user"
      ? menuSidebar.filter(
          (item) => item.name === "Topology" || item.name === "Monitoring" || item.name === "Dashboard"
        )
      : menuSidebar;

  const handleLogout = () => {
    localStorage.clear();
    const allCookies = Cookies.get();
    for (let cookieName in allCookies) {
      Cookies.remove(cookieName, { path: "/" });
    }

    navigate("/auth/login");
    window.location.reload();
  };

  return (
    <div className="relative">
      <div
        className={`${
          isCollapsed ? "w-20" : "w-65"
        } h-full fixed top-0 left-0 flex flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 shadow-2xl border-r border-purple-700/30 transition-all duration-700 ease-in-out`}
        style={{
          transform: 'translateZ(0)', // Force hardware acceleration
          willChange: 'width',
        }}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        
        <div className="relative w-full flex flex-col gap-5 h-full">
          {/* Header */}
          <div className="w-full h-24 shrink-0 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg transition-all duration-700 ease-in-out">
            <div className={`transition-all duration-700 ease-in-out ${
              isCollapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
            }`}>
              {!isCollapsed && (
                <div className="text-center">
                  <h1 className="text-white text-2xl font-bold">OLT-NTCM</h1>
                  <p className="text-purple-100 text-sm">OLT Network Topology & Congestion Monitoring System</p>
                </div>
              )}
            </div>
          </div>

          {/* Menu */}
          <div className="w-full h-fit flex flex-col gap-3 py-6 px-4 overflow-y-auto">
            {filteredMenu.map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`group relative w-full h-fit flex items-center transition-all duration-500 ease-in-out backdrop-blur-sm ${
                    isCollapsed 
                      ? "px-2 py-2 justify-center rounded-xl" 
                      : "px-4 py-4 justify-start rounded-2xl"
                  } ${
                    isActive && !isCollapsed
                      ? "bg-white/90 text-purple-700 shadow-lg shadow-white/25"
                      : isActive && isCollapsed
                      ? ""
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                  style={{
                    transform: 'translateZ(0)', // Force hardware acceleration
                  }}
                >
                  {/* Active indicator - Adjusted for collapsed mode */}
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-r-full transition-all duration-300"></div>
                  )}
                  
                  {/* Active indicator for collapsed mode */}
                  {isActive && isCollapsed && (
                    <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-r-full transition-all duration-300"></div>
                  )}

                  {/* Icon Container - Adjusted for collapsed mode */}
                  <div className={`relative shrink-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                    isCollapsed 
                      ? "w-12 h-12 rounded-xl" 
                      : "w-12 h-12 rounded-xl"
                  } ${
                    isActive 
                      ? "bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg" 
                      : "bg-white/10 group-hover:bg-white/20"
                  }`}>
                    <span className={`text-xl transition-all duration-300 ${
                      isActive ? "text-white" : "text-white/90"
                    }`}>
                      {item.icon}
                    </span>
                  </div>

                  {/* Text Container - Smooth transition */}
                  <div className={`flex items-center overflow-hidden transition-all duration-700 ease-in-out ${
                    isCollapsed
                      ? "opacity-0 w-0 ml-0"
                      : "opacity-100 w-full ml-4"
                  }`}>
                    <p className={`font-semibold text-lg whitespace-nowrap transition-colors duration-300 ${
                      isActive ? "text-purple-700" : "text-white/90"
                    }`}>
                      {item.name}
                    </p>
                  </div>

                  {/* Hover effect */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="relative w-full h-15 shrink-0 flex flex-row items-center gap-3 bg-black/20 backdrop-blur-sm px-4 border-t border-white/10 transition-all duration-700 ease-in-out">
          {/* Profile Avatar - Fixed size */}
          <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 shrink-0 rounded-2xl shadow-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {userInfo.name.charAt(0).toUpperCase() || "G"}
            </span>
          </div>
          
          {/* User Info - Smooth transition */}
          <div className={`flex flex-row items-center gap-2 relative overflow-hidden transition-all duration-700 ease-in-out ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-full"
          }`}>
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-white font-bold truncate text-lg">
                {userInfo.name}
              </p>
              <p className="text-purple-200 text-sm truncate capitalize">
                {userInfo.role}
              </p>
            </div>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-8 h-8 shrink-0 flex items-center justify-center bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200"
            >
              <RiArrowDownSLine
                className={`w-5 h-5 text-white transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && !isCollapsed && (
          <div className="absolute bottom-15 left-4 right-4 z-50 transition-all duration-300 ease-in-out">
            <div className="bg-white/95 backdrop-blur-sm text-purple-700 rounded-xl shadow-xl overflow-hidden border border-white/10 transform transition-all duration-300 ease-in-out animate-in slide-in-from-bottom-2">
              <button
                onClick={handleLogout}
                className="w-full text-left px-6 py-4 hover:bg-purple-50 transition-colors duration-200 font-semibold"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarComponent;