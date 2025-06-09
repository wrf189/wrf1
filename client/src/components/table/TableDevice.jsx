import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../utils/constantApi";
import Cookies from "js-cookie";

const TableDevice = ({ refreshData, onDeleteDevice, onEditDevice, searchTerm }) => {
  const [deviceList, setDeviceList] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDevices = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(`${API_URL}/devices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDeviceList(response.data.devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter devices based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredDevices(deviceList);
    } else {
      const filtered = deviceList.filter((device) =>
        device.hostname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.devicename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.uplink?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDevices(filtered);
    }
  }, [deviceList, searchTerm]);

  useEffect(() => {
    getDevices();
  }, [refreshData]);

  const handleDelete = async (deviceId) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      const token = Cookies.get("token");
      try {
        const response = await axios.delete(`${API_URL}/devices/${deviceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          onDeleteDevice(deviceId);
        }
      } catch (error) {
        console.error("Error deleting device:", error);
      }
    }
  };

  const handleEdit = (device) => {
    onEditDevice(device);
  };

  console.log("deviceList:", deviceList);
  console.log("filteredDevices:", filteredDevices);
  console.log("searchTerm:", searchTerm);

  return (
    <div className="w-full h-full">

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lokasi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hostname
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uplink
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Backuplink
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : filteredDevices.length > 0 ? (
              filteredDevices.map((device, index) => (
                <tr key={device.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span>{device.devicename}</span>
                      {device.portdevicename && (
                        <span className="text-xs text-gray-500">Port: {device.portdevicename}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {device.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className={searchTerm && device.hostname?.toLowerCase().includes(searchTerm.toLowerCase()) 
                      ? "bg-yellow-200 px-1 rounded" : ""}>
                      {device.hostname}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex flex-col">
                      <span className={searchTerm && device.uplink?.toLowerCase().includes(searchTerm.toLowerCase()) 
                        ? "bg-yellow-200 px-1 rounded" : ""}>
                        {device.uplink}
                      </span>
                      {device.portuplink && (
                        <span className="text-xs text-gray-500">Port: {device.portuplink}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      device.backuplink === "YES" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {device.backuplink}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        device.status === "Online" || device.status === "online"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {device.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    <div className="flex justify-end space-x-2">
                      <a href={`/dashboard/device/${device.id}`}>
                        <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200">
                          <FaEye />
                        </button>
                      </a>
                      <button
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
                        onClick={() => handleEdit(device)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-200"
                        onClick={() => handleDelete(device.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {searchTerm ? (
                      <>
                        <p className="text-gray-500 mb-1">Tidak ada perangkat yang ditemukan</p>
                        <p className="text-gray-400 text-xs">Coba ubah kata kunci pencarian Anda</p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-500 mb-1">Belum ada perangkat</p>
                        <p className="text-gray-400 text-xs">Tambahkan perangkat pertama Anda</p>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableDevice;