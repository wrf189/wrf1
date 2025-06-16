import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { RiComputerLine, RiDeleteBinLine, RiEditLine, RiEyeLine } from "react-icons/ri";
import axios from "axios";
import { API_URL } from "../../utils/constantApi";
import Cookies from "js-cookie";

const TableDevice = ({ refreshData, onDeleteDevice, onEditDevice, searchTerm = "" }) => {
  const [deviceList, setDeviceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredDevices, setFilteredDevices] = useState([]);

  const getDevices = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/devices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });
      
      if (response.data && response.data.devices) {
        setDeviceList(response.data.devices);
      } else {
        setDeviceList([]);
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      setDeviceList([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter devices based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = deviceList.filter(device =>
        device.hostname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.devicename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.uplink?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDevices(filtered);
    } else {
      setFilteredDevices(deviceList);
    }
  }, [deviceList, searchTerm]);

  useEffect(() => {
    getDevices();
  }, [refreshData]);

  const handleDelete = async (deviceId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus perangkat ini?")) {
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
        alert("Gagal menghapus perangkat. Silakan coba lagi.");
      }
    }
  };

  const handleEdit = (device) => {
    onEditDevice(device);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "online":
        return "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200";
      case "offline":
        return "bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getBackuplinkBadgeClass = (backuplink) => {
    switch (backuplink?.toUpperCase()) {
      case "YES":
        return "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200";
      case "NO":
        return "bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="bg-gray-50 px-6 py-4">
              <div className="grid grid-cols-8 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="bg-white divide-y divide-gray-200">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="grid grid-cols-8 gap-4 items-center">
                    {[...Array(8)].map((_, j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[200px]">
                  Device
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Hostname
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Uplink
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Backuplink
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDevices.length > 0 ? (
                filteredDevices.map((device, index) => (
                  <tr
                    key={device.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
                          {index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[200px] max-w-[250px]">
                      <div className="flex items-start">
                        <div className="ml-0">
                          <div className="text-sm font-semibold text-gray-900 break-words leading-relaxed">
                            {device.devicename || 'Unknown Device'}
                          </div>
                          {device.portdevicename && (
                            <div className="text-xs text-gray-500 mt-1">
                              Port: {device.portdevicename}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-medium">
                        <span className={searchTerm && device.location?.toLowerCase().includes(searchTerm.toLowerCase()) 
                          ? "bg-yellow-200 px-1 rounded" : ""}>
                          {device.location || 'No location'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-medium">
                        <span className={searchTerm && device.hostname?.toLowerCase().includes(searchTerm.toLowerCase()) 
                          ? "bg-yellow-200 px-1 rounded" : ""}>
                          {device.hostname || 'No hostname'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-medium">
                        <span className={searchTerm && device.uplink?.toLowerCase().includes(searchTerm.toLowerCase()) 
                          ? "bg-yellow-200 px-1 rounded" : ""}>
                          {device.uplink || 'No uplink'}
                        </span>
                        {device.portuplink && (
                          <div className="text-xs text-gray-500">
                            Port: {device.portuplink}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getBackuplinkBadgeClass(
                          device.backuplink
                        )}`}
                      >
                        {device.backuplink || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                          device.status
                        )}`}
                      >
                        {device.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <a href={`/dashboard/device/${device.id}`}>
                          <button
                            className="inline-flex items-center p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                            title="View device"
                          >
                            <RiEyeLine className="w-4 h-4" />
                          </button>
                        </a>
                        <button
                          className="inline-flex items-center p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                          onClick={() => handleEdit(device)}
                          title="Edit device"
                        >
                          <RiEditLine className="w-4 h-4" />
                        </button>
                        <button
                          className="inline-flex items-center p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                          onClick={() => handleDelete(device.id)}
                          title="Delete device"
                        >
                          <RiDeleteBinLine className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <RiComputerLine className="w-12 h-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? "Tidak ada perangkat yang ditemukan" : "Belum ada perangkat"}
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm">
                        {searchTerm 
                          ? `Tidak ada perangkat yang cocok dengan pencarian "${searchTerm}". Coba ubah kata kunci pencarian.`
                          : "Belum ada perangkat yang ditambahkan. Klik tombol 'Tambah Perangkat' untuk membuat perangkat pertama."
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableDevice;