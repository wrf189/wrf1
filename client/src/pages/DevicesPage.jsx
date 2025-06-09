import React, { useState } from "react";
import TableDevice from "../components/table/TableDevice";
import useMod from "../hooks/useMod";
import CreateDeviceMod from "../mods/CreateDeviceMod";
import UpdateDeviceMod from "../mods/UpdateDeviceMod";

const DevicesPage = () => {
  const { modals, handleOpenModal, handleCloseModal } = useMod();
  const [devices, setDevices] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddDevice = (newDevice) => {
    setDevices((prevDevices) => [...prevDevices, newDevice]);
    // Toggle refreshData to trigger a re-fetch in TableDevice
    setRefreshData((prev) => !prev);
    handleCloseModal("createDevice");
  };

  const handleEditDevice = (device) => {
    setSelectedItem(device);
    handleOpenModal("updateDevice");
  };

  const handleUpdateDevice = (updatedDevice) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === updatedDevice.id ? updatedDevice : device
      )
    );
    // Toggle refreshData to trigger a re-fetch in TableDevice
    setRefreshData((prev) => !prev);
    handleCloseModal("updateDevice");
  };

  const handleDeleteDevice = (deviceId) => {
    // Remove device from local state if needed
    setDevices((prevDevices) =>
      prevDevices.filter((device) => device.id !== deviceId)
    );
    // Toggle refreshData to trigger a re-fetch in TableDevice
    setRefreshData((prev) => !prev);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="w-full h-fit min-h-screen bg-gray-100 p-6 flex flex-col gap-6">
      <p className="text-2xl font-bold">Management Perangkat</p>
      <div className="w-full h-full bg-white rounded-3xl shadow-lg p-5 flex flex-col gap-5">
        <div className="w-full flex items-center justify-end gap-5">
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Cari berdasarkan hostname..."
              className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded-full cursor-pointer transition-colors duration-200"
            onClick={() => handleOpenModal("createDevice")}
          >
            Tambah Perangkat
          </button>
        </div>
        <div className="w-full h-full">
          <TableDevice
            data={devices}
            refreshData={refreshData}
            onDeleteDevice={handleDeleteDevice}
            onEditDevice={handleEditDevice}
            searchTerm={searchTerm}
          />
        </div>
      </div>

      {modals.createDevice && (
        <CreateDeviceMod
          onClose={() => handleCloseModal("createDevice")}
          onCreated={handleAddDevice}
        />
      )}

      {modals.updateDevice && selectedItem && (
        <UpdateDeviceMod
          onClose={() => handleCloseModal("updateDevice")}
          onUpdated={handleUpdateDevice}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default DevicesPage;