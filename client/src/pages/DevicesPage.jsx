import React, { useState } from "react";
import { RiComputerLine, RiAddLine, RiSearchLine } from "react-icons/ri";
import TableDevice from "../components/table/TableDevice";
import TableSubDevice from "../components/table/TableSubDevice";
import useMod from "../hooks/useMod";
import CreateDeviceMod from "../mods/CreateDeviceMod";
import UpdateDeviceMod from "../mods/UpdateDeviceMod";
import CreateSubDeviceMod from "../mods/CreateSubDeviceMod";
import UpdateSubDeviceMod from "../mods/UpdateSubDeviceMod";

const DevicesPage = () => {
  const { modals, handleOpenModal, handleCloseModal } = useMod();
  const [devices, setDevices] = useState([]);
  const [subDevices, setSubDevices] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [refreshSubData, setRefreshSubData] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null); // Tambahkan state untuk device ID
  const [searchTerm, setSearchTerm] = useState("");
  const [subSearchTerm, setSubSearchTerm] = useState("");

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

  const handleAddSubDevice = (newSubDevice) => {
    setSubDevices((prevSubDevices) => [...prevSubDevices, newSubDevice]);
    setRefreshSubData((prev) => !prev);
    handleCloseModal("createSubDevice");
  };

  // Update fungsi ini untuk menerima deviceId
  const handleCreateSubDevice = (deviceId) => {
    setSelectedDeviceId(deviceId); // Set device ID yang dipilih
    handleOpenModal("createSubDevice");
  };

  const handleEditSubDevice = (subDevice) => {
    setSelectedItem(subDevice);
    handleOpenModal("updateSubDevice");
  };

  const handleUpdateSubDevice = (updatedSubDevice) => {
    setSubDevices((prevSubDevices) =>
      prevSubDevices.map((subDevice) =>
        subDevice.id === updatedSubDevice.id ? updatedSubDevice : subDevice
      )
    );
    setRefreshSubData((prev) => !prev);
    handleCloseModal("updateSubDevice");
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

        {/* Tables Container - Vertical Layout */}
        <div className="space-y-4">
          {/* Main Devices Table */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            {/* Header with Actions */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Main Devices</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {/* Search Bar */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <RiSearchLine className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search Device..."
                      className="block w-full sm:w-56 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Add Device Button */}
                  <button
                    onClick={() => handleOpenModal("createDevice")}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <RiAddLine className="w-4 h-4" />
                    Add New Device
                  </button>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-auto px-6 py-4 max-h-80">
              <TableDevice
                data={devices}
                refreshData={refreshData}
                onDeleteDevice={handleDeleteDevice}
                onEditDevice={handleEditDevice}
                onCreateSubDevice={handleCreateSubDevice} // Pass fungsi yang sudah diupdate
                searchTerm={searchTerm}
              />
            </div>
          </div>

          {/* Sub Devices Table */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            {/* Header with Actions */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Sub Devices</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {/* Search Bar */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <RiSearchLine className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search Sub Device..."
                      className="block w-full sm:w-56 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={subSearchTerm}
                      onChange={(e) => setSubSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-auto px-6 py-4 max-h-80">
              <TableSubDevice
                refreshData={refreshSubData}
                searchTerm={subSearchTerm}
                onEditSubDevice={handleEditSubDevice}
              />
            </div>
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

      {modals.createSubDevice && (
        <CreateSubDeviceMod
          onClose={() => handleCloseModal("createSubDevice")}
          onCreated={handleAddSubDevice}
          id={selectedDeviceId} // Pass device ID ke modal
        />
      )}

      {modals.updateSubDevice && selectedItem && (
        <UpdateSubDeviceMod
          onClose={() => handleCloseModal("updateSubDevice")}
          onUpdated={handleUpdateSubDevice}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default DevicesPage;