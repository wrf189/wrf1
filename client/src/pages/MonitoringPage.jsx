import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { RiComputerFill, RiAlarmWarningFill, RiShieldCheckFill, RiErrorWarningFill } from "react-icons/ri";
import { API_URL } from "../utils/constantApi";
import TableOlt from "../components/table/TableOlt";

const MonitoringPage = () => {
  const [oltApiNisa, setOltApiNisa] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [redundancyCount, setRedundancyCount] = useState(0);
  const [statusCount, setStatusCount] = useState(0);

  const fetchOltData = async () => {
    try {
      const formData = new FormData();
      formData.append("username", "wangsa.fatahillah");
      formData.append("password", "e0c9fcfd8400dd6898379e977292047b");

      const loginRes = await axios.post(
        "https://apicore.oss.myrepublic.co.id/authenticate/login",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const token = loginRes.data?.data?.access_token;
      if (!token) throw new Error("Failed to get login token");

      const oltRes = await axios.get(
        "https://apinisa.oss.myrepublic.co.id/api/referential/datalink/olt",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setOltApiNisa(oltRes.data);
    } catch (error) {
      console.error("Error fetching OLT data:", error);
    }
  };

  const fetchDevice = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(`${API_URL}/devices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeviceData(response.data.devices);

      const count = response.data.devices.filter(
        (d) => d.backuplink === "NO"
      ).length;
      setRedundancyCount(count);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

    const fetchStatusDevice = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(`${API_URL}/devices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeviceData(response.data.devices);

      const count = response.data.devices.filter(
        (d) => d.status === "offline"
      ).length;
      setStatusCount(count);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  useEffect(() => {
    fetchOltData();
    fetchDevice();
    fetchStatusDevice();
  }, []);

  const dashboardData = [
    {
      title: "OLT Congestion",
      quantity: oltApiNisa?.total || 0,
      icon: RiAlarmWarningFill,
      bgColor: "bg-orange-500", // Oranye untuk peringatan congestion
    },
    {
      title: "OLT Need Redundancy",
      quantity: redundancyCount,
      icon: RiShieldCheckFill,
      bgColor: "bg-blue-500", // Biru untuk redundancy/backup
    },
    {
      title: "OLT Down",
      quantity: statusCount,
      icon: RiErrorWarningFill,
      bgColor: "bg-red-500", // Merah untuk status down/error
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="w-full p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <RiComputerFill className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monitoring</h1>
            <p className="text-gray-600 mt-1">OLT Congested Monitoring Dashboard</p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {dashboardData.map((device, index) => {
            const IconComponent = device.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl ${device.bgColor} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {device.title}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {device.quantity}
                      </span>
                      <span className="text-sm text-gray-500">Devices</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-semibold text-gray-900">OLT Device Status</h2>
            <p className="text-gray-600 mt-1">Overview of all OLT Congestion device</p>
          </div>
          <div className="p-8">
            <TableOlt dataOlt={oltApiNisa} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;