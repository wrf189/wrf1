import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaSearch } from "react-icons/fa";
import { API_URL } from "../utils/constantApi";
import TableSubDevice from "../components/table/TableSubDevice";
import useMod from "../hooks/useMod";
import CreateSubDeviceMod from "../mods/CreateSubDeviceMod";
import UpdateSubDeviceMod from "../mods/UpdateSubDeviceMod";

const DeviceDetailPage = () => {
  const id = window.location.pathname.split("/")[3];
  const [device, setDevice] = useState({});
  const { modals, handleOpenModal, handleCloseModal, selectdItem } = useMod();
  const [refreshData, setRefreshData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddSubDevice = () => {
    getDeviceById(); // Fetch data ulang dari backend
    setRefreshData((prev) => !prev);
    handleCloseModal("createDevice");
  };

  const handleEditSubDevice = (subDevice) => {
    handleOpenModal("updateSubDevice", subDevice);
  };

  const handleUpdatedSubDevice = () => {
    getDeviceById(); // jika ingin update detail device juga
    setRefreshData((prev) => !prev); // untuk trigger re-fetch table subdevice
    handleCloseModal("updateSubDevice");
  };

  const getDeviceById = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(`${API_URL}/devices/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDevice(response.data.device);
    } catch (error) {
      console.error("Error fetching device:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    getDeviceById();
  }, []);

  return (
    <div className="w-full h-fit min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
      <p className="text-2xl font-bold">
        Detail Perangkat: {device.devicename}
      </p>
      <div className="w-full h-full bg-white rounded-3xl shadow-lg p-5 flex flex-col gap-5">
        <div className="w-full flex items-center justify-between gap-4">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari berdasarkan hostname..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Button Tambah Sub Perangkat */}
          <button
            className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded-full cursor-pointer whitespace-nowrap"
            onClick={() => handleOpenModal("createSubDevice")}
          >
            Tambah Sub Perangkat
          </button>
        </div>
        <div className="w-full h-full">
          <TableSubDevice
            refreshData={refreshData}
            searchTerm={searchTerm}
            onEditSubDevice={handleEditSubDevice}
          />
        </div>
      </div>

      {modals.createSubDevice && (
        <CreateSubDeviceMod
          onClose={() => handleCloseModal("createSubDevice")}
          onCreated={handleAddSubDevice}
          id={id}
        />
      )}

      {modals.updateSubDevice && selectdItem && (
        <UpdateSubDeviceMod
          onClose={() => handleCloseModal("updateSubDevice")}
          item={selectdItem}
          onUpdated={handleUpdatedSubDevice}
        />
      )}
    </div>
  );
};

export default DeviceDetailPage;
