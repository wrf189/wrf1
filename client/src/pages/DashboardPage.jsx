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

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
      <p className="text-2xl font-semibold">Dashboard</p>

      {loading ? (
        <p className="text-2xl font-semibold text-center text-gray-300">
          Loading...
        </p>
      ) : (
        <div className="w-full h-full flex flex-col gap-5">
          <div className="w-full h-full flex flex-col gap-2">
            <p className="text-2xl font-semibold">Informasi User</p>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {Array.isArray(dashboardData.users) &&
                dashboardData.users.map((user, index) => (
                  <div
                    key={index}
                    className="w-full bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 transition duration-300 hover:shadow-xl"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center transition duration-300">
                      {user.title.toLowerCase() === "admin" ? (
                        <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center transition duration-300">
                          <RiUserSettingsFill className="w-8 h-8 text-white" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center transition duration-300">
                          <RiUserFill className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold capitalize">
                        {user.title}
                      </p>
                      <span className="text-gray-500 text-sm">
                        {user.quantity} akun
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="w-full h-full flex flex-col gap-2">
            <p className="text-2xl font-semibold">Informasi Perangkat</p>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(dashboardData.devices) &&
                dashboardData.devices.map((device, index) => (
                  <div
                    key={index}
                    className="w-full bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 transition duration-300 hover:shadow-xl"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center transition duration-300">
                      <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center transition duration-300">
                        <RiComputerFill className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold">{device.title}</p>
                      <span className="text-gray-500 text-sm">
                        {device.quantity}
                      </span>
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
