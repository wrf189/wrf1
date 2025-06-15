import React, { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
import { API_URL } from "../utils/constantApi";
import Cookies from "js-cookie";

const CreateUserMod = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Set default value
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
      const response = await axios.post(`${API_URL}/auth/register`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 201) {
        console.log("User created successfully");
        // Pass the new user data to the parent component
        onCreated(response.data.user);
        onClose();
      } else {
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
      <div className="p-5 bg-white rounded-lg w-full max-w-md flex flex-col gap-5">
        <div className="flex flex-row items-center justify-between">
          <p className="text-lg font-semibold">Create User</p>
          <RiCloseLine
            className="text-2xl hover:cursor-pointer"
            onClick={onClose}
          />
        </div>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2"
              required
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
            className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded-lg mt-3 cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserMod;