import React, { useState } from "react";
import { RiUserLine, RiUserAddLine, RiSearchLine } from "react-icons/ri";
import TableUser from "../components/table/TableUser";
import useMod from "../hooks/useMod";
import CreateUserMod from "../mods/CreateUserMod";
import UpdateUserMod from "../mods/UpdateUserMod";

const UsersPage = () => {
  const { modals, handleOpenModal, handleCloseModal } = useMod();
  const [users, setUsers] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setRefreshData((prev) => !prev);
    handleCloseModal("createUser");
  };

  const handleEditUser = (user) => {
    setSelectedItem(user);
    handleOpenModal("updateUser");
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setRefreshData((prev) => !prev);
    handleCloseModal("updateUser");
  };

  const handleDeleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    setRefreshData((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="w-full p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <RiUserLine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header with Actions */}
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Users List</h2>
                <p className="text-gray-600 text-sm mt-1">Manage user accounts and permissions</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiSearchLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Add User Button */}
                <button
                  onClick={() => handleOpenModal("createUser")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <RiUserAddLine className="w-4 h-4" />
                  Add New User
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="p-8">
            <TableUser
              data={users}
              refreshData={refreshData}
              onDeleteUser={handleDeleteUser}
              onEditUser={handleEditUser}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {modals.createUser && (
        <CreateUserMod
          onClose={() => handleCloseModal("createUser")}
          onCreated={handleAddUser}
        />
      )}

      {modals.updateUser && selectedItem && (
        <UpdateUserMod
          onClose={() => handleCloseModal("updateUser")}
          onUpdated={handleUpdateUser}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default UsersPage;