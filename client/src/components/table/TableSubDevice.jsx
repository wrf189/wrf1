import React, { useEffect, useState } from "react";
import { RiDeleteBinLine, RiEditLine, RiDeviceLine } from "react-icons/ri";
import axios from "axios";
import { API_URL } from "../../utils/constantApi";
import Cookies from "js-cookie";

const TableSubDevice = ({ refreshData, searchTerm, onEditSubDevice }) => {
  const [subDeviceList, setSubDeviceList] = useState([]);
  const [filteredSubDeviceList, setFilteredSubDeviceList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSubDevices = async () => {
    const token = Cookies.get("token");
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/sub-device`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });

      if (response.data && response.data.data) {
        setSubDeviceList(response.data.data);
      } else {
        setSubDeviceList([]);
      }
    } catch (error) {
      console.error("Error fetching subdevices:", error);
      setSubDeviceList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubDevices();
  }, [refreshData]);

  // Filter data berdasarkan hostname, subdevicename, dan device name
  useEffect(() => {
    if (!searchTerm || searchTerm === "") {
      setFilteredSubDeviceList(subDeviceList);
    } else {
      const filtered = subDeviceList.filter(
        (subDevice) =>
          subDevice.hostname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          subDevice.subdevicename
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          subDevice.device?.devicename
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          subDevice.portdevice
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          subDevice.portsubdevice
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredSubDeviceList(filtered);
    }
  }, [searchTerm, subDeviceList]);

  const handleDeleteSubDevice = async (id) => {
    if (
      window.confirm("Apakah Anda yakin ingin menghapus sub perangkat ini?")
    ) {
      const token = Cookies.get("token");
      try {
        const response = await axios.delete(`${API_URL}/sub-device/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          getSubDevices();
        }
      } catch (error) {
        console.error("Error deleting subdevice:", error);
        alert("Gagal menghapus sub perangkat. Silakan coba lagi.");
      }
    }
  };

  const handleEdit = (subDevice) => {
    onEditSubDevice(subDevice);
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="bg-gray-50 px-6 py-4">
              <div className="grid grid-cols-7 gap-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="bg-white divide-y divide-gray-200">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="grid grid-cols-7 gap-4 items-center">
                    {[...Array(7)].map((_, j) => (
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
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[180px]">
                  Main Device
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Hostname Sub Device
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[180px]">
                  Sub Device
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubDeviceList.length > 0 ? (
                filteredSubDeviceList.map((subDevice, index) => (
                  <tr
                    key={subDevice.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
                          {index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[180px] max-w-[220px]">
                      <div className="flex items-start">
                        <div className="ml-0">
                          <div className="text-sm font-semibold text-gray-900 break-words leading-relaxed">
                            <span
                              className={
                                searchTerm &&
                                subDevice.device?.devicename
                                  ?.toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                                  ? "bg-yellow-200 px-1 rounded"
                                  : ""
                              }
                            >
                              {subDevice.device?.devicename || "Unknown Device"}
                            </span>
                          </div>
                          {subDevice.device?.portdevicename && (
                            <div className="text-xs text-gray-500 mt-1">
                              Port: {subDevice.portdevice}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-medium">
                        <span
                          className={
                            searchTerm &&
                            subDevice.hostname
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase())
                              ? "bg-yellow-200 px-1 rounded"
                              : ""
                          }
                        >
                          {subDevice.hostname || "No hostname"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[180px] max-w-[220px]">
                      <div className="flex items-start">
                        <div className="ml-0">
                          <div className="text-sm font-semibold text-gray-900 break-words leading-relaxed">
                            <span
                              className={
                                searchTerm &&
                                subDevice.subdevicename
                                  ?.toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                                  ? "bg-yellow-200 px-1 rounded"
                                  : ""
                              }
                            >
                              {subDevice.subdevicename || "Unknown Sub Device"}
                            </span>
                          </div>
                          {subDevice.portsubdevice && (
                            <div className="text-xs text-gray-500 mt-1">
                              Port: {subDevice.portsubdevice}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          className="inline-flex items-center p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                          onClick={() => handleEdit(subDevice)}
                          title="Edit sub device"
                        >
                          <RiEditLine className="w-4 h-4" />
                        </button>
                        <button
                          className="inline-flex items-center p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                          onClick={() => handleDeleteSubDevice(subDevice.id)}
                          title="Delete sub device"
                        >
                          <RiDeleteBinLine className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <RiDeviceLine className="w-12 h-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm
                          ? "Tidak ada sub perangkat yang ditemukan"
                          : "Belum ada sub perangkat"}
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm">
                        {searchTerm
                          ? `Tidak ada sub perangkat yang cocok dengan pencarian "${searchTerm}". Coba ubah kata kunci pencarian.`
                          : "Belum ada sub perangkat yang ditambahkan. Klik tombol 'Tambah Sub Perangkat' untuk membuat sub perangkat pertama."}
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

export default TableSubDevice;
