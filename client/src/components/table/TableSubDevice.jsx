import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../utils/constantApi";
import Cookies from "js-cookie";

const TableSubDevice = ({ refreshData, searchTerm }) => {
  const [subDeviceList, setSubDeviceList] = useState([]);
  const [filteredSubDeviceList, setFilteredSubDeviceList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSubDevices = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(`${API_URL}/sub-device`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubDeviceList(response.data.data);
    } catch (error) {
      console.error("Error fetching subdevices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubDevices();
  }, [refreshData]);

  // Filter data berdasarkan hostname dari parent
  useEffect(() => {
    if (!searchTerm || searchTerm === "") {
      setFilteredSubDeviceList(subDeviceList);
    } else {
      const filtered = subDeviceList.filter((subDevice) =>
        subDevice.hostname?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubDeviceList(filtered);
    }
  }, [searchTerm, subDeviceList]);

  const handleDeleteSubDevice = async (id) => {
    const token = Cookies.get("token");
    try {
      await axios.delete(`${API_URL}/sub-device/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getSubDevices();
    } catch (error) {
      console.error("Error deleting subdevice:", error);
    }
  };

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
                Hostname
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Port Device
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sub Device
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Port Sub Device
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center px-6 py-4 text-sm text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredSubDeviceList.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center px-6 py-4 text-sm text-gray-500"
                >
                  {searchTerm
                    ? "Tidak ada data yang sesuai dengan pencarian"
                    : "No data available"}
                </td>
              </tr>
            ) : (
              filteredSubDeviceList.map((subDevice, index) => (
                <tr key={subDevice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subDevice.device?.devicename}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subDevice.hostname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subDevice.portdevice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subDevice.subdevicename}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subDevice.portsubdevice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors mr-2">
                      <FaEdit />
                    </button>
                    <button
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      onClick={() => handleDeleteSubDevice(subDevice.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSubDevice;
