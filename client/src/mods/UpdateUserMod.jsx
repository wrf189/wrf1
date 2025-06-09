import React, { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
import { API_URL } from "../utils/constantApi";
import Cookies from "js-cookie";

const UpdateUserMod = ({ onClose, onUpdated, item }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with user data
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        email: item.email || "",
        password: "", // Password field is empty by default when editing
        role: item.role || ""
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const token = Cookies.get("token");
    
    // Create payload - exclude password if it's empty
    const payload = { ...formData };
    if (!payload.password) {
      delete payload.password;
    }
    
    try {
      const response = await axios.put(`${API_URL}/users/${item.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 200) {
        onUpdated(response.data.user);
      } else {
        setError("Failed to update user. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
      <div className="p-5 bg-white rounded-lg w-full max-w-md flex flex-col gap-5">
        <div className="flex flex-row items-center justify-between">
          <p className="text-lg font-semibold">Update User</p>
          <RiCloseLine
            className="text-2xl hover:cursor-pointer"
            onClick={onClose}
          />
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">
              Password <span className="text-gray-400 text-sm">(Leave empty to keep current password)</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              className="border border-gray-300 rounded-md p-2"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-800"
            } text-white px-4 py-2 rounded-lg mt-3 cursor-pointer`}
          >
            {loading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserMod;