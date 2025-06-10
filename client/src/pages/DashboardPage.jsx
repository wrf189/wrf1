import React, { useEffect, useState } from "react";
import { RiComputerFill, RiUserFill, RiUserSettingsFill } from "react-icons/ri";
import axios from "axios";
import { API_URL } from "../utils/constantApi";
import Cookies from "js-cookie";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(`${API_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  // Fungsi untuk memeriksa apakah user adalah admin
  const isAdmin = () => {
    return dashboardData.userRole === "admin";
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex flex-col gap-6">
      {/* Header dengan glassmorphism effect */}
      <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-6 shadow-lg border border-white/20">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1 text-base">
          Welcome to MyRepublic OLT Network Topology
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-ping"></div>
          </div>
          <p className="text-xl font-semibold text-gray-400 mt-6 animate-pulse">
            Memuat data...
          </p>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-6">
          {/* Informasi User Section - Hanya tampil untuk admin */}
          {isAdmin() && dashboardData.users && (
            <div className="w-full">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  Informasi User
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(dashboardData.users) &&
                  dashboardData.users.map((user, index) => (
                    <div
                      key={index}
                      className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/30 hover:shadow-xl hover:scale-102 transition-all duration-300 overflow-hidden"
                    >
                      {/* Background gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative flex items-center gap-4">
                        <div className="relative">
                          {user.title.toLowerCase() === "admin" ? (
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-md group-hover:shadow-red-300/50 transition-all duration-300">
                              <RiUserSettingsFill className="w-7 h-7 text-white" />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-blue-300/50 transition-all duration-300">
                              <RiUserFill className="w-7 h-7 text-white" />
                            </div>
                          )}
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                        </div>
                        
                        <div className="flex flex-col">
                          <h3 className="text-xl font-bold text-gray-800 capitalize mb-0.5">
                            {user.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 text-base">
                              {user.quantity}
                            </span>
                            <span className="text-gray-500 text-base">akun</span>
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse ml-1"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Informasi Perangkat Section - Tampil untuk semua role */}
          <div className="w-full">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Informasi Perangkat
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.isArray(dashboardData.devices) &&
                dashboardData.devices.map((device, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/30 hover:shadow-xl hover:scale-102 transition-all duration-300 overflow-hidden"
                  >
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md group-hover:shadow-green-300/50 transition-all duration-300">
                          <RiComputerFill className="w-7 h-7 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                      </div>
                      
                      <div className="flex flex-col">
                        <h3 className="text-xl font-bold text-gray-800 mb-0.5">
                          {device.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-base font-semibold">
                            {device.quantity}
                          </span>
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-teal-400 rounded-full animate-pulse ml-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;