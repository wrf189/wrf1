import React, { useState } from "react";
import { RiComputerLine, RiAddLine, RiSearchLine } from "react-icons/ri";
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
    setRefreshData((prev) => !prev);
    handleCloseModal("updateDevice");
  };

  const handleDeleteDevice = (deviceId) => {
    setDevices((prevDevices) =>
      prevDevices.filter((device) => device.id !== deviceId)
    );
    setRefreshData((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="w-full p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <RiComputerLine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Devices Management</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header with Actions */}
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Devices List</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiSearchLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search Device..."
                    className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Add Device Button */}
                <button
                  onClick={() => handleOpenModal("createDevice")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <RiAddLine className="w-4 h-4" />
                  Add New Device
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="p-8">
            <TableDevice
              data={devices}
              refreshData={refreshData}
              onDeleteDevice={handleDeleteDevice}
              onEditDevice={handleEditDevice}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
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