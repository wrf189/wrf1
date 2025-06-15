import React, { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
import { API_URL } from "../utils/constantApi";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const UpdateSubDeviceMod = ({ item, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    deviceId: "",
    hostname: "",
    subdevicename: "",
    portdevice: "",
    portsubdevice: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        deviceId: item.deviceId || "",
        hostname: item.hostname || "",
        subdevicename: item.subdevicename || "",
        portdevice: item.portdevice || "",
        portsubdevice: item.portsubdevice || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    try {
      const response = await axios.put(`${API_URL}/sub-device/${item.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Sub Device updated successfully!");
        onUpdated?.(response.data.device); // optional callback
        onClose();
      } else {
        toast.error("Failed to update Sub Device.");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      console.error("Error updating sub device:", error);
    }
  };

  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
      <div className="p-5 bg-white rounded-lg w-full max-w-md flex flex-col gap-5">
        <div className="flex flex-row items-center justify-between">
          <p className="text-lg font-semibold">Update Sub Device</p>
          <RiCloseLine
            className="text-2xl hover:cursor-pointer"
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="deviceId">Device ID</label>
            <input
              type="text"
              id="deviceId"
              name="deviceId"
              value={formData.deviceId}
              readOnly
              className="border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="hostname">Hostname</label>
            <input
              type="text"
              id="hostname"
              name="hostname"
              value={formData.hostname}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="portdevice">Port Device</label>
            <input
              type="text"
              id="portdevice"
              name="portdevice"
              value={formData.portdevice}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="subdevicename">Sub Device Name</label>
            <input
              type="text"
              id="subdevicename"
              name="subdevicename"
              value={formData.subdevicename}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="portsubdevice">Port Sub Device</label>
            <input
              type="text"
              id="portsubdevice"
              name="portsubdevice"
              value={formData.portsubdevice}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSubDeviceMod;
