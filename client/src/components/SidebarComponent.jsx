import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { RiArrowDownSLine, RiDashboardFill, RiUserFill, RiBaseStationFill, RiComputerFill, RiGitForkFill } from "react-icons/ri";
import Cookies from "js-cookie";

const menuSidebar = [
  { name: "Dashboard", path: "/dashboard", icon: <RiDashboardFill /> },
  { name: "Users", path: "/dashboard/users", icon: <RiUserFill /> },
  { name: "Perangkat", path: "/dashboard/devices", icon: <RiBaseStationFill /> },
  { name: "Topologi", path: "/dashboard/topologi", icon: <RiGitForkFill /> },
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
          (item) => item.name === "Topologi" || item.name === "Monitoring"
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
          isCollapsed ? "w-20" : "w-60"
        } h-full fixed top-0 left-0 transition-all duration-300 flex flex-col gap-5 bg-purple-600`}
      >
        <div className="w-full flex flex-col gap-5 h-full">
          {/* Header */}
          <div className="w-full h-20 shrink-0 bg-red-500" />

          {/* Menu */}
          <div className="w-full h-fit flex flex-col gap-2 py-4 px-2 overflow-y-auto">
            {filteredMenu.map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`w-full h-fit px-4 py-2 rounded-md flex items-center ${
                    isActive
                      ? "bg-white text-purple-600 font-semibold"
                      : "text-white hover:bg-purple-500"
                  } ${
                    isCollapsed ? "justify-center gap-0" : "justify-start gap-2"
                  } transition-all duration-300`}
                >
                  {/* Icon Placeholder */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <p
                      className={`text-xl ${
                        isActive
                          ? "text-purple-600 font-semibold"
                          : "text-white hover:bg-purple-500"
                      }`}
                    >
                      {item.icon}
                    </p>
                  </div>

                  {/* Text */}
                  <p
                    className={`${
                      isCollapsed
                        ? "opacity-0 w-0 overflow-hidden"
                        : "opacity-100 w-auto"
                    } transition-all duration-300`}
                  >
                    {item.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="w-full h-20 shrink-0 flex flex-row items-center justify-center gap-2 bg-white/20 px-4 relative">
          {/* Profile */}
          <div className="w-10 h-10 bg-red-500 shrink-0 rounded-full"></div>
          {!isCollapsed && (
            <div className="flex flex-row items-center gap-2 w-full relative">
              <div className="flex flex-col w-full">
                <p className="text-white font-semibold truncate">
                  {userInfo.name}
                </p>
                <p className="text-white text-sm truncate">{userInfo.role}</p>
              </div>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-6 h-6 shrink-0 flex items-center justify-center"
              >
                <RiArrowDownSLine
                  className={`w-full h-full text-white ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          )}
        </div>
        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute bottom-14 left-0 w-full flex justify-end">
            <div className="bg-white text-purple-600 rounded-md shadow-lg overflow-hidden w-40">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-purple-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarComponent;
