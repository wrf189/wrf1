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

  // State untuk error handling
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors
    
    const token = Cookies.get("token");
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 201) {
        console.log("User created successfully");
        // Show success message (optional)
        // alert(response.data.message); // "User created successfully"
        
        // Pass the new user data to the parent component
        onCreated(response.data.user);
        onClose();
      } else {
        setError("Failed to create user. Please try again.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message;
        
        switch (statusCode) {
          case 400:
            // Backend mengirim pesan spesifik untuk validation errors
            setError(errorMessage || "Invalid data provided. Please check your input.");
            break;
          case 401:
            setError("Unauthorized. Please login again.");
            break;
          case 403:
            setError("You don't have permission to create users.");
            break;
          case 500:
            setError(errorMessage || "Internal server error. Please try again later.");
            break;
          default:
            setError(errorMessage || "An error occurred while creating user.");
        }
      } else if (error.request) {
        // Network error
        setError("Network error. Please check your internet connection.");
      } else {
        // Other errors
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
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
        
        {/* Error Message Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button
            type="submit"
            className={`${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-500 hover:bg-blue-800 cursor-pointer"
            } text-white px-4 py-2 rounded-lg mt-3 transition-colors duration-200`}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserMod;