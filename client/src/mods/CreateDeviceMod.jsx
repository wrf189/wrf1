import React, { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
import { API_URL } from "../utils/constantApi";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const CreateDeviceMod = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    devicename: "",
    portdevicename: "",
    location: "",
    hostname: "",
    uplink: "",
    portuplink: "",
    backuplink: "",
    status: "",
    portdevicename_backup: "",
    portuplink_backup: "",
    backupType: "",
    backupToDevice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    try {
      const response = await axios.post(`${API_URL}/devices`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("Device created successfully!");
        onClose();
        onCreated(response.data.device);
      } else {
        toast.error("Device creation failed. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message); // Contoh: "Field wajib diisi semua"
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      console.error("Error creating device:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Device
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Add a new device to your network
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-full transition-colors duration-200"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Form Container with Scroll */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label
                    htmlFor="devicename"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Device Name
                  </label>
                  <input
                    type="text"
                    id="devicename"
                    name="devicename"
                    placeholder="Enter device name"
                    value={formData.devicename}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="portdevicename"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Port
                  </label>
                  <input
                    type="text"
                    id="portdevicename"
                    name="portdevicename"
                    placeholder="Port"
                    value={formData.portdevicename}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="hostname"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Hostname
                  </label>
                  <input
                    type="text"
                    id="hostname"
                    name="hostname"
                    placeholder="Enter hostname"
                    value={formData.hostname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Network Configuration Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Network Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label
                    htmlFor="uplink"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Uplink
                  </label>
                  <input
                    type="text"
                    id="uplink"
                    name="uplink"
                    placeholder="Enter uplink"
                    value={formData.uplink}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="portuplink"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Uplink Port
                  </label>
                  <input
                    type="text"
                    id="portuplink"
                    name="portuplink"
                    placeholder="Port"
                    value={formData.portuplink}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="backuplink"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Has Backup Link
                  </label>
                  <select
                    id="backuplink"
                    name="backuplink"
                    value={formData.backuplink}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Backup Configuration */}
            {formData.backuplink === "YES" && (
              <div className="space-y-4 p-4 rounded-lg border border-gray-200 mb-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2">
                  Backup Configuration
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Backup Type
                  </label>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="backupType"
                        value="uplink"
                        checked={formData.backupType === "uplink"}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Uplink
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="backupType"
                        value="device"
                        checked={formData.backupType === "device"}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Device
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="backupToDevice"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Backup To
                  </label>
                  <input
                    type="text"
                    id="backupToDevice"
                    name="backupToDevice"
                    placeholder="Enter backup destination"
                    value={formData.backupToDevice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="portdevicename_backup"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Port Device Backup
                    </label>
                    <input
                      type="text"
                      id="portdevicename_backup"
                      name="portdevicename_backup"
                      placeholder="Enter port"
                      value={formData.portdevicename_backup}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="portuplink_backup"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Port Uplink Backup
                    </label>
                    <input
                      type="text"
                      id="portuplink_backup"
                      name="portuplink_backup"
                      placeholder="Enter port"
                      value={formData.portuplink_backup}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="sticky bottom-0 border-t border-gray-200 px-6 py-4 bg-white flex justify-end space-x-3 shadow-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors duration-200 font-medium"
          >
            Create Device
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDeviceMod;
