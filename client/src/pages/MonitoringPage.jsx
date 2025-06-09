import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { RiComputerFill } from "react-icons/ri";
import { API_URL } from "../utils/constantApi";
import TableOlt from "../components/table/TableOlt";

const MonitoringPage = () => {
  const [oltApiNisa, setOltApiNisa] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [redundancyCount, setRedundancyCount] = useState(0);

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

  useEffect(() => {
    fetchOltData();
    fetchDevice();
  }, []);

  const dashboardData = [
    {
      title: "OLT Congestion",
      quantity: oltApiNisa?.total,
    },
    {
      title: "OLT Need Redudancy",
      quantity: redundancyCount,
    },
    {
      title: "Link Down",
      quantity: 5,
    },
  ];

  return (
    <div className="w-full h-full min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
      <p className="text-2xl font-bold">Management Monitoring</p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.map((device, index) => (
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
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">
                  {device.quantity}
                </span>
                <p className="text-gray-500 text-sm">Devices</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full h-full shadow-md bg-white rounded-2xl p-5">
        <TableOlt dataOlt={oltApiNisa} />
      </div>
    </div>
  );
};

export default MonitoringPage;
