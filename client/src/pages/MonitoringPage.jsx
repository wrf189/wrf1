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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOltData = async () => {
    try {
      const res = await axios.get(`${API_URL}/proxy/olt-monitoring`);
      setOltApiNisa(res.data);
    } catch (error) {
      console.error("Error fetching OLT data via proxy:", error);
      setError("Failed to fetch OLT monitoring data");
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
      setError("Failed to fetch device data");
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
      setError("Failed to fetch status data");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchOltData(),
          fetchDevice(),
          fetchStatusDevice()
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-gray-500">Loading...</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-gray-900">
                            {device.quantity}
                          </span>
                          <span className="text-sm text-gray-500">Devices</span>
                        </>
                      )}
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">OLT Device Status</h2>
                <p className="text-gray-600 mt-1">Overview of all OLT Congestion device</p>
              </div>
              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">Loading...</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-8">
            {loading ? (
              <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 font-medium">Loading monitoring data...</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Please wait while we fetch the OLT device information
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="w-full h-64 flex items-center justify-center bg-red-50 rounded-xl border border-red-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RiErrorWarningFill className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-red-600 font-medium">Error loading data</p>
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                </div>
              </div>
            ) : (
              <TableOlt dataOlt={oltApiNisa} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;